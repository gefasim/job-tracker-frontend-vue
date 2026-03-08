<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({ link: false }),
    Link.configure({
      openOnClick: false,
      autolink: true,
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

const setLink = () => {
  if (editor.value?.isActive('link')) {
    editor.value.chain().focus().unsetLink().run()
    return
  }

  const previousUrl = editor.value?.getAttributes('link').href
  const url = window.prompt('Enter link (URL):', previousUrl)

  if (url === null) return

  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}
</script>

<template>
  <div class="editor-container">
    <div v-if="editor" class="toolbar">
      <div class="button-group">
        <button @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()">
          ↩
        </button>
        <button @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()">
          ↪
        </button>
      </div>

      <div class="divider"></div>
      <div class="button-group">
        <button
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }"
        >
          <strong>B</strong>
        </button>
        <button
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }"
        >
          <em>I</em>
        </button>
        <button
          @click="editor.chain().focus().toggleUnderline().run()"
          :class="{ 'is-active': editor.isActive('underline') }"
        >
          <u>U</u>
        </button>
        <button
          @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }"
        >
          <s>S</s>
        </button>
      </div>

      <div class="divider"></div>

      <div class="button-group">
        <button
          @click="editor.chain().focus().setTextAlign('left').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
        >
          ⬅
        </button>
        <button
          @click="editor.chain().focus().setTextAlign('center').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
        >
          ↔
        </button>
        <button
          @click="editor.chain().focus().setTextAlign('right').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
        >
          ➡
        </button>
      </div>

      <div class="divider"></div>

      <div class="button-group">
        <button
          @click="setLink"
          :class="{ 'is-active': editor.isActive('link') }"
          title="Додати/Видалити посилання"
        >
          🔗
        </button>
      </div>

      <div class="divider"></div>

      <div class="button-group">
        <button
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }"
        >
          •≣
        </button>
        <button
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor.isActive('orderedList') }"
        >
          1≣
        </button>
      </div>
    </div>

    <editor-content :editor="editor" class="editor-content" />
  </div>
</template>

<style scoped>
.editor-container {
  border: 1px solid #dadce0;
  border-radius: 8px;
  background: #fffdf0;
}

.toolbar {
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 8px;
  background: white;
  border-bottom: 1px solid #dadce0;
  flex-wrap: wrap;
}

.button-group {
  display: flex;
  gap: 2px;
}

.divider {
  width: 1px;
  height: 20px;
  background: #dadce0;
}

button {
  background: transparent;
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  color: #5f6368;
  font-weight: bold;
}

button.is-active {
  background: #e8f0fe;
  color: #1a73e8;
}

:deep(.tiptap) {
  padding: 16px;
  min-height: 150px;
  outline: none;
}

:deep(.tiptap p[style*='text-align: center']) {
  text-align: center;
}
:deep(.tiptap p[style*='text-align: right']) {
  text-align: right;
}
:deep(.tiptap a) {
  color: #1a73e8;
  text-decoration: underline;
  cursor: pointer;
}
</style>
