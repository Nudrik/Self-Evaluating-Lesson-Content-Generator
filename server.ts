import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { createGeminiClient, runPipeline, evaluateLesson } from './server/agentEngine.js';
import {
  getMemoryRules,
  addMemoryRule,
  toggleMemoryRule,
  deleteMemoryRule,
  resetMemoryRules,
} from './server/memoryStore.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  const ai = createGeminiClient();

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
  });

  // Persistent Memory Rules API
  app.get('/api/memory', (req, res) => {
    res.json({ rules: getMemoryRules() });
  });

  app.post('/api/memory/rule', (req, res) => {
    const { rule } = req.body;
    if (!rule || !rule.title || !rule.ruleText) {
      return res.status(400).json({ error: 'Invalid rule payload' });
    }
    const newRule = {
      id: rule.id || `rule-${Date.now()}`,
      title: rule.title,
      category: rule.category || 'PEDAGOGY',
      ruleText: rule.ruleText,
      originTopic: rule.originTopic || 'User Defined',
      learnedFromIteration: rule.learnedFromIteration || 1,
      createdAt: rule.createdAt || new Date().toISOString(),
      active: rule.active !== false,
      timesApplied: rule.timesApplied || 1,
    };
    addMemoryRule(newRule);
    res.json({ success: true, rule: newRule, rules: getMemoryRules() });
  });

  app.patch('/api/memory/rule/:id/toggle', (req, res) => {
    const updated = toggleMemoryRule(req.params.id);
    if (!updated) {
      return res.status(404).json({ error: 'Rule not found' });
    }
    res.json({ success: true, rule: updated, rules: getMemoryRules() });
  });

  app.delete('/api/memory/rule/:id', (req, res) => {
    const deleted = deleteMemoryRule(req.params.id);
    res.json({ success: deleted, rules: getMemoryRules() });
  });

  app.post('/api/memory/reset', (req, res) => {
    const rules = resetMemoryRules();
    res.json({ success: true, rules });
  });

  // Run the full agentic loop
  app.post('/api/pipeline/run', async (req, res) => {
    try {
      const {
        topic,
        learnerLevel,
        maxRetries = 2,
        forceStrictRejectionFirst = false,
        activeMemoryRules,
      } = req.body;

      if (!topic || typeof topic !== 'string') {
        return res.status(400).json({ error: 'Topic is required.' });
      }

      const rulesToUse = activeMemoryRules || getMemoryRules();

      const result = await runPipeline(ai, {
        topic,
        learnerLevel,
        maxRetries,
        forceStrictRejectionFirst,
        activeMemoryRules: rulesToUse,
      });

      // Auto-save newly synthesized rules
      if (result.synthesizedRules && result.synthesizedRules.length > 0) {
        for (const rule of result.synthesizedRules) {
          addMemoryRule(rule);
        }
      }

      res.json(result);
    } catch (error: any) {
      console.error('[API /api/pipeline/run] Error:', error);
      res.status(500).json({
        error: error.message || 'Pipeline execution failed',
        details: String(error),
      });
    }
  });

  // Standalone Evaluation Endpoint
  app.post('/api/pipeline/evaluate', async (req, res) => {
    try {
      const { lesson, forceStrict = false } = req.body;
      if (!lesson) {
        return res.status(400).json({ error: 'Lesson is required.' });
      }

      const report = await evaluateLesson(ai, lesson, forceStrict);
      res.json(report);
    } catch (error: any) {
      console.error('[API /api/pipeline/evaluate] Error:', error);
      res.status(500).json({
        error: error.message || 'Evaluation failed',
        details: String(error),
      });
    }
  });

  // Mount Vite or serve static files
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[Self-Evaluating Lesson Content Generator] Server running at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
