type SharedProfileViewProps {
    name: string;
    avatarUrl: string | null;
    title?: string | null;
    location?: string | null;
    website?: string | null;
    linkedin?: string | null;
    summary?: string | null;
}

const SharedProfileView = ({ name, avatarUrl, title, location, website, linkedin, summary }: SharedProfileViewProps) => {
  return (
    <div className="flex flex-col gap-4">

        
    </div>
  )
}

export default SharedProfileView