import Link from 'next/link'
import { Button } from '@/components/common/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-8 text-center">
      <div className="text-5xl">🌙</div>
      <div className="text-xl font-semibold">这里还没有内容</div>
      <Link href="/">
        <Button>回首页</Button>
      </Link>
    </div>
  )
}
