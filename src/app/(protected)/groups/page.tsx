import { GroupList } from '@/components/groups/GroupList/GroupList'

export default function GroupsPage() {
  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0" style={{ color: 'var(--mg-text)' }}>
                Grupos
              </h1>
            </div>
          </div>
        </div>
      </div>
      <section className="content">
        <div className="container-fluid">
          <GroupList />
        </div>
      </section>
    </>
  )
}
