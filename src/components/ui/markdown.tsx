import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/cn'

/** Renders trusted markdown (blog posts, project case studies) with site prose styles. */
export function Markdown({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn('prose-portfolio', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node: _node, ...props }) => (
            <a {...props} target={props.href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer noopener" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
