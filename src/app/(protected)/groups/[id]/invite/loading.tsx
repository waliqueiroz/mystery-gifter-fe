import { SkeletonBox } from '@/components/ui/Skeleton/SkeletonBox'
import { SkeletonText } from '@/components/ui/Skeleton/SkeletonText'

export default function InviteLoading() {
  return (
    <div
      className="flex flex-col gap-4"
      data-testid="invite-loading"
    >
      <div className="flex items-center gap-2">
        <SkeletonBox height={32} width={32} borderRadius={9999} />
        <SkeletonText width="30%" />
      </div>
      <div className="flex flex-col gap-3 rounded-card bg-mg-surface p-4">
        <SkeletonText width="70%" />
        <SkeletonBox height={48} borderRadius={9999} />
      </div>
    </div>
  )
}
