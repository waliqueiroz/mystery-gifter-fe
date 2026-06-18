import { SkeletonBox } from '@/components/ui/Skeleton/SkeletonBox'
import { SkeletonCircle } from '@/components/ui/Skeleton/SkeletonCircle'
import { SkeletonText } from '@/components/ui/Skeleton/SkeletonText'

export default function ProfileLoading() {
  return (
    <div
      className="flex flex-col gap-4"
      data-testid="profile-loading"
    >
      <SkeletonText width="40%" />
      <div className="flex flex-col gap-4 rounded-card bg-mg-surface p-6">
        <div className="flex items-center gap-4">
          <SkeletonCircle size={64} />
          <div className="flex flex-col gap-2 flex-grow">
            <SkeletonText width="60%" />
            <SkeletonText width="40%" />
          </div>
        </div>
        <SkeletonBox height={40} borderRadius={4} />
        <SkeletonBox height={40} borderRadius={4} />
      </div>
      <SkeletonBox height={40} borderRadius={9999} />
    </div>
  )
}
