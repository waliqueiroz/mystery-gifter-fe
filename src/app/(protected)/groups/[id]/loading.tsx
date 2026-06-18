import { SkeletonBox } from '@/components/ui/Skeleton/SkeletonBox'
import { SkeletonText } from '@/components/ui/Skeleton/SkeletonText'

export default function GroupDetailLoading() {
  return (
    <div
      className="flex flex-col gap-4"
      data-testid="group-detail-loading"
    >
      <SkeletonText width="60%" />
      <SkeletonBox height={120} borderRadius={8} />
      <SkeletonBox height={160} borderRadius={8} />
      <SkeletonBox height={80} borderRadius={8} />
    </div>
  )
}
