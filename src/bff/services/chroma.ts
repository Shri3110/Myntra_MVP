import { ChromaClient } from 'chromadb';

const chroma = new ChromaClient({ path: "http://localhost:8000" });

export const connectChroma = async () => {
  try {
    const version = await chroma.version();
    console.log(`[Chroma DB] Connected to Chroma DB (version ${version})`);
    
    // Create collections if they don't exist
    await chroma.getOrCreateCollection({ name: "product_embeddings" });
    await chroma.getOrCreateCollection({ name: "user_style_profiles" });
    
    console.log(`[Chroma DB] Collections ready`);
  } catch (error) {
    console.error('[Chroma DB] Failed to connect', error);
  }
};

export default chroma;
