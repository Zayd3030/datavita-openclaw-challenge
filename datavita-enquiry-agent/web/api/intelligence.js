import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { qualificationData } = req.body;

  if (!qualificationData) {
    return res.status(400).json({ error: 'Missing qualificationData' });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const serviceContextMap = {
    hpc_ai: 'DataVita CoreWeave partnership GPU AI infrastructure Scotland AI Growth Zone',
    national_cloud: 'DataVita National Cloud Scottish Government G-Cloud sovereign cloud Scotland',
    colocation: 'DataVita DV1 DV2 co-location Tier III Scotland renewable energy',
    connectivity: 'DataVita connectivity carrier-neutral Glasgow Scotland bandwidth',
    design_build: 'DataVita design build data centre Scotland AI Growth Zone Lanarkshire',
  };

  const searchQuery = serviceContextMap[qualificationData.mapped_service] ||
    'DataVita Scotland AI Growth Zone CoreWeave 2025 2026';

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      system: `You are a market intelligence assistant for DataVita's sales team. Search for current information about DataVita, Scotland's AI Growth Zone designation in Lanarkshire, and the CoreWeave partnership. Return a concise 2-3 paragraph intelligence summary that would help a DataVita sales person walk into a meeting with this prospect already informed. Focus on facts, figures, and recent developments relevant to the prospect's specific needs. Be concrete and specific — mention actual stats, dates, and announcements where available.`,
      messages: [
        {
          role: 'user',
          content: `Search for: ${searchQuery}\n\nThe prospect needs: ${qualificationData.mapped_service}. Their workload type: ${qualificationData.workload_type}. Return only the intelligence summary, no preamble.`,
        },
      ],
    });

    const intelligenceText = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    return res.json({ context: intelligenceText });
  } catch (error) {
    console.error('Intelligence fetch error:', error);
    return res.json({
      context: `DataVita operates two Tier III certified data centres in Scotland: DV1 in Lanarkshire (100% renewable energy, PUE 1.18) and DV2 at 177 Bothwell Street, Glasgow city centre. Lanarkshire has been designated a UK AI Growth Zone, positioning DataVita at the centre of Scotland's national AI infrastructure strategy.\n\nDataVita has a strategic partnership with CoreWeave, enabling access to GPU clusters and high-performance compute infrastructure for AI training and inference workloads at scale. This makes DataVita uniquely positioned to serve both traditional enterprise co-location needs and next-generation AI/ML workloads.\n\nKey clients include the Scottish Government, Virgin Money, South Lanarkshire Council, North Lanarkshire Council, and CGI — demonstrating the breadth of DataVita's client base from regulated public sector to financial services.`,
    });
  }
}
