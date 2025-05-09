
import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';

// Define the state shape
interface PromptingState {
  // Scanner state
  promptInput: string;
  improvedPrompt: string;
  feedbackHistory: Array<{
    feedback: string;
    result: string;
  }>;
  currentFeedback: string;
  requestCount: number;
  requestLimit: number;
  isProcessing: boolean;
  apiError: string | null;
  
  // Designer state
  activeDesignerPrompt: any; // We'll type this more specifically if needed
  promptResponse: string;
  compiledPrompt: string;
  isTestingPrompt: boolean;
  designerRequestCount: number;
}

// Define action types
type PromptingAction = 
  | { type: 'SET_PROMPT_INPUT'; payload: string }
  | { type: 'SET_IMPROVED_PROMPT'; payload: string }
  | { type: 'SET_CURRENT_FEEDBACK'; payload: string }
  | { type: 'ADD_FEEDBACK_HISTORY'; payload: { feedback: string; result: string } }
  | { type: 'SET_REQUEST_COUNT'; payload: number }
  | { type: 'SET_IS_PROCESSING'; payload: boolean }
  | { type: 'SET_API_ERROR'; payload: string | null }
  | { type: 'RESET_SCANNER' }
  | { type: 'SET_ACTIVE_DESIGNER_PROMPT'; payload: any }
  | { type: 'SET_PROMPT_RESPONSE'; payload: string }
  | { type: 'SET_COMPILED_PROMPT'; payload: string }
  | { type: 'SET_IS_TESTING_PROMPT'; payload: boolean }
  | { type: 'SET_DESIGNER_REQUEST_COUNT'; payload: number }
  | { type: 'RESET_DESIGNER' };

// Initial state
const initialState: PromptingState = {
  promptInput: '',
  improvedPrompt: '',
  feedbackHistory: [],
  currentFeedback: '',
  requestCount: 0,
  requestLimit: 10, // Default limit
  isProcessing: false,
  apiError: null,
  activeDesignerPrompt: null,
  promptResponse: '',
  compiledPrompt: '',
  isTestingPrompt: false,
  designerRequestCount: 0,
};

// Create the context
const PromptingContext = createContext<{
  state: PromptingState;
  dispatch: Dispatch<PromptingAction>;
} | undefined>(undefined);

// Reducer function
function promptingReducer(state: PromptingState, action: PromptingAction): PromptingState {
  switch (action.type) {
    case 'SET_PROMPT_INPUT':
      return { ...state, promptInput: action.payload };
    case 'SET_IMPROVED_PROMPT':
      return { ...state, improvedPrompt: action.payload };
    case 'SET_CURRENT_FEEDBACK':
      return { ...state, currentFeedback: action.payload };
    case 'ADD_FEEDBACK_HISTORY':
      return { 
        ...state, 
        feedbackHistory: [...state.feedbackHistory, action.payload] 
      };
    case 'SET_REQUEST_COUNT':
      return { ...state, requestCount: action.payload };
    case 'SET_IS_PROCESSING':
      return { ...state, isProcessing: action.payload };
    case 'SET_API_ERROR':
      return { ...state, apiError: action.payload };
    case 'RESET_SCANNER':
      return {
        ...state,
        promptInput: '',
        improvedPrompt: '',
        feedbackHistory: [],
        currentFeedback: '',
        isProcessing: false,
        apiError: null,
      };
    case 'SET_ACTIVE_DESIGNER_PROMPT':
      return { ...state, activeDesignerPrompt: action.payload };
    case 'SET_PROMPT_RESPONSE':
      return { ...state, promptResponse: action.payload };
    case 'SET_COMPILED_PROMPT':
      return { ...state, compiledPrompt: action.payload };
    case 'SET_IS_TESTING_PROMPT':
      return { ...state, isTestingPrompt: action.payload };
    case 'SET_DESIGNER_REQUEST_COUNT':
      return { ...state, designerRequestCount: action.payload };
    case 'RESET_DESIGNER':
      return {
        ...state,
        activeDesignerPrompt: null,
        promptResponse: '',
        compiledPrompt: '',
        isTestingPrompt: false,
      };
    default:
      return state;
  }
}

// Provider component
interface PromptingProviderProps {
  children: ReactNode;
}

export const PromptingProvider: React.FC<PromptingProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(promptingReducer, initialState);
  
  return (
    <PromptingContext.Provider value={{ state, dispatch }}>
      {children}
    </PromptingContext.Provider>
  );
};

// Custom hook for using the context
export const usePromptingContext = () => {
  const context = useContext(PromptingContext);
  if (context === undefined) {
    throw new Error('usePromptingContext must be used within a PromptingProvider');
  }
  return context;
};
