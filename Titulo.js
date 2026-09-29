export default function Titulo({ children, sub }) {
  return (
    <div className="mb-10 max-w-2xl">
      <h2 className="font-serif text-3xl md:text-4xl font-semibold">{children}</h2>
      {sub && <p className="mt-2 text-tinta/70">{sub}</p>}
    </div>
  );
}
