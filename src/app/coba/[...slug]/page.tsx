export default function page({ params }: { params: { slug: string[] } }) {
  if (params.slug?.length === 2) {
    return (
      <h1>
        param {params.slug[0]}, param {params.slug[1]}
      </h1>
    );
  }

  if (params.slug?.length === 1) {
    return <h1>param {params.slug[0]}</h1>;
  }
  return <h1>No Params</h1>;
}
