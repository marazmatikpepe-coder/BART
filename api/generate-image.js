export default async function handler(req,res){
 res.setHeader('Access-Control-Allow-Origin',process.env.ALLOWED_ORIGIN||'*');res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');if(req.method==='OPTIONS')return res.status(204).end();if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 // The provided notes contain a SambaNova model identifier, but no verified image-generation endpoint/model contract.
 // Never pretend that text-to-image generation succeeded. Connect a confirmed image provider here when configured.
 return res.status(501).json({error:'Генерация изображений пока не подключена к подтверждённому image-generation API. Чат, анализ изображений и файлов доступны отдельно.'});
}
