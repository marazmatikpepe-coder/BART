export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  if (!process.env.GROQ_API_KEY) return res.status(503).json({error:'Не задан GROQ_API_KEY на сервере. Добавьте его в Environment Variables.'});
  try {
    const {messages = [], mode = 'normal'} = req.body || {};
    if (!Array.isArray(messages) || !messages.length) return res.status(400).json({error:'Пустой запрос'});
    const safe = messages.slice(-16).map(m => ({role: ['user','assistant'].includes(m.role) ? m.role : 'user', content: m.content}));
    const modeHint = ({normal:'Отвечай ясно, дружелюбно и по делу.', analysis:'Разбирай задачу внимательно, показывай проверяемые выводы и допущения.', code:'Ты опытный программист. Давай рабочий код, объясняй ключевые решения.'})[mode] || 'Отвечай ясно и по делу.';
    safe.unshift({role:'system', content:`Ты Bart — универсальный ИИ-помощник. Отвечай на языке пользователя. ${modeHint} Если прикреплены файлы или изображения, анализируй их содержимое, не выдумывай то, чего не видно.`});
    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {method:'POST', headers:{'Authorization':`Bearer ${process.env.GROQ_API_KEY}`,'Content-Type':'application/json'}, body:JSON.stringify({model:process.env.GROQ_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct',messages:safe,temperature:0.6,max_tokens:4096})});
    const data = await upstream.json();
    if (!upstream.ok) return res.status(upstream.status).json({error:data?.error?.message || 'Ошибка провайдера ИИ'});
    return res.status(200).json({reply:data.choices?.[0]?.message?.content || 'Не удалось получить ответ.', model:data.model});
  } catch(e) { return res.status(500).json({error:'Ошибка сервера при обращении к ИИ.'}); }
}
