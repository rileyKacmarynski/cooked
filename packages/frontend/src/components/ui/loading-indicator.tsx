import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { LoaderIcon } from 'lucide-react'

const loaderVariants = cva('animate-spin stroke-accent-foreground', {
  variants: {
    size: {
      sm: 'size-4',
      md: 'size-6',
      lg: 'size-8',
      xl: 'size-10',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
})

export function LoadingIndicator({
  className,
  size,
  ...props
}: React.ComponentProps<'svg'> & VariantProps<typeof loaderVariants>) {
  return (
    <LoaderIcon
      className={cn(loaderVariants({ size, className }))}
      {...props}
    />
  )
}

export function FullPageLoader() {
  return (
    <div className="grid h-full place-items-center">
      <LoadingIndicator
        size="xl"
        className="dark:stroke-stone-500 stroke-stone-400"
      />
    </div>
  )
}
