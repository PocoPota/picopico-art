type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function OnePost({ params }: PageProps) {
  const { slug } = await params;
  return(
    <div>{slug}</div>
  );
}