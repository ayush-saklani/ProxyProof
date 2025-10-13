import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <nav>
        <ul>
          <li>
            <Link href="/student">Student</Link>
          </li>
          <li>
            <Link href="/faculty">Faculty</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
