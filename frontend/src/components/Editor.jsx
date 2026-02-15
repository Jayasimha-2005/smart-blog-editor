import { useEffect, useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical';
import useEditorStore from '../store/editorStore';
import useAutoSave from '../hooks/useAutoSave';
import { postsAPI } from '../services/api';
import Toolbar from './Toolbar';
import AIButton from './AIButton';

const theme = {
  paragraph: 'editor-paragraph',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
  },
  list: {
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
  },
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    underline: 'editor-text-underline',
  },
};

// Plugin to update Zustand store on content change
function OnChangePluginWrapper() {
  const updateContent = useEditorStore((state) => state.updateContent);

  const onChange = (editorState) => {
    editorState.read(() => {
      const json = editorState.toJSON();
      updateContent(json);
    });
  };

  return <OnChangePlugin onChange={onChange} />;
}

// Plugin to initialize editor with existing content
function InitialContentPlugin({ content }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (content && Object.keys(content).length > 0) {
      const editorState = editor.parseEditorState(content);
      editor.setEditorState(editorState);
    }
  }, [content, editor]);

  return null;
}

// Wrapper component to provide editor access to AIButton
function AIButtonWrapper() {
  const [editor] = useLexicalComposerContext();

  // Extract plain text from Lexical editor
  const extractPlainText = () => {
    let text = '';
    editor.getEditorState().read(() => {
      const root = $getRoot();
      text = root.getTextContent();
    });
    return text;
  };

  // Insert AI-generated text into editor
  const insertText = (text) => {
    editor.update(() => {
      const root = $getRoot();
      
      // Create new paragraph with the AI-generated text
      const paragraph = $createParagraphNode();
      
      // Split text by newlines and create text nodes
      const lines = text.split('\n');
      lines.forEach((line, index) => {
        const textNode = $createTextNode(line);
        paragraph.append(textNode);
        
        // Add line breaks between lines (but not after the last one)
        if (index < lines.length - 1) {
          const lineBreak = $createTextNode('\n');
          paragraph.append(lineBreak);
        }
      });
      
      // Append to the end of the document
      root.append(paragraph);
    });
  };

  return (
    <AIButton 
      extractPlainText={extractPlainText}
      onInsertText={insertText}
    />
  );
}

function Editor() {
  const currentPost = useEditorStore((state) => state.currentPost);
  const updateTitle = useEditorStore((state) => state.updateTitle);
  const setSaving = useEditorStore((state) => state.setSaving);
  const markAsSaved = useEditorStore((state) => state.markAsSaved);
  const markAsFailed = useEditorStore((state) => state.markAsFailed);
  const hasUnsavedChanges = useEditorStore((state) => state.hasUnsavedChanges);

  // Auto-save callback
  const handleAutoSave = async () => {
    if (!currentPost || !hasUnsavedChanges) return;

    setSaving(true);
    try {
      const response = await postsAPI.updatePost(currentPost.id, {
        title: currentPost.title,
        content_json: currentPost.content_json,
      });
      markAsSaved(response.data);
      console.log('Auto-saved successfully at:', new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Auto-save failed:', error);
      markAsFailed();
    }
  };

  // Implement auto-save with 2 second debounce
  // Triggers only when post content or title changes
  // Cancels previous save if user keeps typing or switches posts
  const { cancel: cancelAutoSave } = useAutoSave(
    handleAutoSave,
    2000, // 2 second delay
    [
      currentPost?.id,
      currentPost?.title,
      currentPost?.content_json,
    ]
  );

  // Cancel auto-save when post switches
  useEffect(() => {
    return () => {
      cancelAutoSave();
    };
  }, [currentPost?.id, cancelAutoSave]);

  const initialConfig = {
    namespace: 'SmartBlogEditor',
    theme,
    onError: (error) => console.error(error),
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
  };

  if (!currentPost) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p className="text-lg mb-2">No post selected</p>
          <p className="text-sm">Select a post or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Title Input */}
      <div className="border-b border-gray-200 px-6 py-4">
        <input
          type="text"
          value={currentPost.title || ''}
          onChange={(e) => updateTitle(e.target.value)}
          placeholder="Untitled"
          className="w-full text-4xl font-bold outline-none placeholder-gray-300"
        />
      </div>

      {/* Lexical Editor */}
      <LexicalComposer initialConfig={initialConfig} key={currentPost.id}>
        <div className="flex-1 flex flex-col">
          <Toolbar />
          
          {/* AI Tools Bar */}
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
            <div className="text-xs text-gray-500 font-medium">AI Tools</div>
            <AIButtonWrapper />
          </div>
          
          <div className="flex-1 overflow-auto">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="editor-input" />
              }
              placeholder={
                <div className="absolute top-4 left-6 text-gray-400 pointer-events-none">
                  Start writing...
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          <HistoryPlugin />
          <ListPlugin />
          <OnChangePluginWrapper />
          <InitialContentPlugin content={currentPost.content_json} />
        </div>
      </LexicalComposer>

      {/* Status Bar */}
      <div className="border-t border-gray-200 px-6 py-2 text-sm text-gray-500">
        Status: {currentPost.status === 'published' ? '✅ Published' : '📝 Draft'}
      </div>
    </div>
  );
}

export default Editor;
