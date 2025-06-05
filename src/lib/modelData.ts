
import { AIModel, ModelProvider } from './types';

export const modelProviders: ModelProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    icon: 'brain',
    models: [
      {
        id: 'gpt-4.1-2025-04-14',
        displayName: 'GPT-4.1 (Latest)',
        provider: 'openai',
        contextWindow: 128000,
        icon: 'brain',
        capabilities: ['text', 'vision', 'reasoning', 'code'],
        pricing: 'medium',
        description: 'Most advanced and capable OpenAI model',
        strengths: ['Complex reasoning', 'Code generation', 'Creative writing'],
        bestFor: ['Complex analysis', 'Programming', 'Creative tasks']
      },
      {
        id: 'gpt-4o-mini',
        displayName: 'GPT-4o Mini',
        provider: 'openai',
        contextWindow: 128000,
        icon: 'zap',
        capabilities: ['text', 'vision', 'speed'],
        pricing: 'low',
        description: 'Fast and efficient model for most tasks',
        strengths: ['Speed', 'Cost efficiency', 'General purpose'],
        bestFor: ['Quick responses', 'Simple tasks', 'High volume']
      }
    ]
  },
  {
    id: 'google',
    name: 'Google',
    icon: 'sparkles',
    models: [
      {
        id: 'gemini-1.5-pro',
        displayName: 'Gemini 1.5 Pro',
        provider: 'google',
        contextWindow: 2000000,
        icon: 'sparkles',
        capabilities: ['text', 'vision', 'long-context', 'reasoning'],
        pricing: 'medium',
        description: 'Google\'s most capable model with massive context',
        strengths: ['Long context', 'Multimodal', 'Research tasks'],
        bestFor: ['Document analysis', 'Research', 'Long conversations']
      },
      {
        id: 'gemini-1.5-flash',
        displayName: 'Gemini 1.5 Flash',
        provider: 'google',
        contextWindow: 1000000,
        icon: 'zap',
        capabilities: ['text', 'vision', 'speed', 'long-context'],
        pricing: 'low',
        description: 'Fast Gemini model with large context window',
        strengths: ['Speed', 'Large context', 'Cost effective'],
        bestFor: ['Quick analysis', 'Summarization', 'Real-time tasks']
      }
    ]
  }
];

export const getAllModels = (): AIModel[] => {
  return modelProviders.flatMap(provider => provider.models);
};

export const getModelsByProvider = (providerId: string): AIModel[] => {
  const provider = modelProviders.find(p => p.id === providerId);
  return provider?.models || [];
};

export const getModelById = (modelId: string): AIModel | undefined => {
  return getAllModels().find(model => model.id === modelId);
};

export const getProviderIcon = (providerId: string): string => {
  const provider = modelProviders.find(p => p.id === providerId);
  return provider?.icon || 'brain';
};

export const getModelRecommendations = (modelId: string): string[] => {
  const model = getModelById(modelId);
  if (!model) return [];

  const recommendations = [];
  
  if (model.provider === 'openai') {
    recommendations.push('Use clear, specific instructions');
    recommendations.push('Break complex tasks into steps');
    recommendations.push('Provide examples for better results');
  } else if (model.provider === 'google') {
    recommendations.push('Leverage the large context window');
    recommendations.push('Use structured prompts for best results');
    recommendations.push('Take advantage of multimodal capabilities');
  }

  if (model.capabilities?.includes('vision')) {
    recommendations.push('Can analyze images and visual content');
  }
  
  if (model.capabilities?.includes('long-context')) {
    recommendations.push('Excellent for processing long documents');
  }

  if (model.pricing === 'low') {
    recommendations.push('Cost-effective for high-volume tasks');
  }

  return recommendations;
};
