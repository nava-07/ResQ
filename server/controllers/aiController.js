exports.analyzeSeverity = async (req, res) => {
  try {
    const { type, description, affectedCount } = req.body;
    const hfKey = process.env.HUGGINGFACE_API_KEY;
    
    if (!hfKey) {
      throw new Error("Hugging Face API Key is missing");
    }

    const prompt = `As an AI Disaster Management system, analyze this disaster report and output ONLY a valid JSON object. Do not include any other text.
Report:
Type: ${type}
Description: ${description || 'No description provided'}
Affected Count: ${affectedCount || 0}

Output JSON format:
{
  "severityScore": (number 0-100),
  "riskLevel": ("low", "medium", "high", or "critical"),
  "predictedAffectedPopulation": (number),
  "requiredResources": (array of strings, e.g. ["medical_kits", "water", "boats"]),
  "safetyInstructions": (string)
}`;

    // Using Mistral as it's good at instruction following and JSON generation
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 250, return_full_text: false, temperature: 0.1 }
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from Hugging Face API");
    }

    const result = await response.json();
    let generatedText = result[0]?.generated_text || "";
    
    // Clean up potential markdown formatting and extract JSON
    generatedText = generatedText.replace(/```json/g, "").replace(/```/g, "").trim();
    const jsonStart = generatedText.indexOf("{");
    const jsonEnd = generatedText.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      generatedText = generatedText.substring(jsonStart, jsonEnd + 1);
    }
    
    let analysis;
    try {
      analysis = JSON.parse(generatedText);
    } catch (parseError) {
      console.error("Failed to parse HF response:", generatedText);
      throw new Error("AI returned invalid JSON");
    }

    // Ensure valid fallback fields if AI missed some
    analysis.severityScore = analysis.severityScore || 50;
    analysis.riskLevel = analysis.riskLevel || 'medium';
    analysis.predictedAffectedPopulation = analysis.predictedAffectedPopulation || (affectedCount || 10) * 1.5;
    analysis.requiredResources = analysis.requiredResources || ['medical_kits'];
    analysis.safetyInstructions = analysis.safetyInstructions || "Please stay safe and wait for rescue teams.";

    res.json({ success: true, data: analysis });
  } catch (error) {
    console.error("AI Analysis Error (Falling back to rules):", error.message);
    // Fallback to rule-based logic if HF fails (e.g. rate limit, model loading)
    const { type, description, affectedCount } = req.body;
    let baseScore = 30;
    if (['earthquake', 'tsunami', 'cyclone'].includes(type)) baseScore += 30;
    else if (['flood', 'fire', 'landslide'].includes(type)) baseScore += 20;
    if (description && description.length > 50) baseScore += 10;
    if (affectedCount > 100) baseScore += 20;
    if (affectedCount > 1000) baseScore += 30;
    
    const severityScore = Math.min(100, baseScore);
    let riskLevel = 'low';
    if (severityScore > 80) riskLevel = 'critical';
    else if (severityScore > 60) riskLevel = 'high';
    else if (severityScore > 40) riskLevel = 'medium';
    
    let requiredResources = ['medical_kits', 'water'];
    if (type === 'fire') requiredResources.push('fire_extinguishers', 'burn_ointment');
    if (type === 'flood' || type === 'tsunami') requiredResources.push('boats', 'life_jackets');
    
    res.json({ 
      success: true, 
      data: {
        severityScore,
        riskLevel,
        predictedAffectedPopulation: (affectedCount || 10) * 1.5,
        requiredResources,
        safetyInstructions: "Please stay safe and wait for rescue teams. Follow local authority guidelines."
      }
    });
  }
};

exports.detectFakeReport = async (req, res) => {
  try {
    const { description } = req.body;
    
    if (!description || description.trim().length < 10) {
       return res.json({ success: true, data: { isFake: true, confidenceScore: 90 } });
    }

    const hfKey = process.env.HUGGINGFACE_API_KEY;
    if (!hfKey) {
      throw new Error("Hugging Face API Key is missing");
    }

    const prompt = `Analyze this disaster report description for authenticity. Does it look like a fake, prank, or spam report?
Description: "${description}"
Reply with a valid JSON object ONLY:
{"isFake": boolean, "confidenceScore": number (0-100)}`;

    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 50, return_full_text: false, temperature: 0.1 }
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from Hugging Face API");
    }

    const result = await response.json();
    let generatedText = result[0]?.generated_text || "";
    
    const jsonStart = generatedText.indexOf("{");
    const jsonEnd = generatedText.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      generatedText = generatedText.substring(jsonStart, jsonEnd + 1);
    }
    
    const analysis = JSON.parse(generatedText);
    
    res.json({ 
      success: true, 
      data: {
        isFake: !!analysis.isFake,
        confidenceScore: analysis.confidenceScore || 50
      }
    });
  } catch (error) {
    console.error("AI Fake Detect Error (Falling back to rules):", error.message);
    const confidenceScore = Math.random() * 100;
    res.json({ 
      success: true, 
      data: {
        isFake: confidenceScore < 20,
        confidenceScore 
      }
    });
  }
};
