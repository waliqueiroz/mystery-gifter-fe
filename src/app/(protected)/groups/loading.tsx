import { SkeletonBox } from '@/components/ui/Skeleton/SkeletonBox'

export default function GroupsLoading() {
  return (
    <div
      className="flex flex-col gap-4"
      data-testid="groups-loading"
    >
      <SkeletonBox height={48} borderRadius={9999} />
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <SkeletonBox key={i} height={72} borderRadius={8} />
        ))}
      </div>
    </div>
  )
}
