import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const dataPath = path.join(process.cwd(), 'data.json');
    const raw = fs.readFileSync(dataPath, 'utf8');
    const parsed = JSON.parse(raw);
    
    // Hide settings (bot tokens, etc.) from public API
    delete parsed.settings;
    
    res.status(200).json(parsed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load data' });
  }
}
