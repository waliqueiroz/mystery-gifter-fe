import { SkeletonBox } from '@/components/ui/Skeleton/SkeletonBox'
import { SkeletonText } from '@/components/ui/Skeleton/SkeletonText'

export default function NewGroupLoading() {
  return (
    <div
      className="flex flex-col gap-4"
      data-testid="new-group-loading"
    >
      <SkeletonText width="40%" />
      <div className="flex flex-col gap-3 rounded-card bg-mg-surface p-4">
        <SkeletonBox height={44} borderRadius={9999} />
        <SkeletonBox height={44} borderRadius={9999} />
        <SkeletonBox height={44} borderRadius={9999} />
      </div>
    </div>
  )
}
