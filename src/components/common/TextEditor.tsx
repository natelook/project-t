import React from 'react';
import { Editor, EditorContent, FloatingMenu } from '@tiptap/react';
import classNames from 'classnames';

interface TextEditorProps {
  editor: Editor;
}

/* eslint-disable-next-line */
const TextEditor = ({ editor }: TextEditorProps) => {
  return (
    <div className="min-h-full bg-white p-0.5 rounded-lg">
      {editor && (
        <FloatingMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="space-x-2"
        >
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={classNames(
              'text-editor-floating-button',
              editor.isActive('heading', { level: 1 }) ? 'is-active' : '',
            )}
          >
            h1
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={classNames(
              'text-editor-floating-button',
              editor.isActive('heading', { level: 2 }) ? 'is-active' : '',
            )}
          >
            h2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={classNames(
              'text-editor-floating-button',
              editor.isActive('bulletList') ? 'is-active' : '',
            )}
          >
            bullet list
          </button>
        </FloatingMenu>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TextEditor;
