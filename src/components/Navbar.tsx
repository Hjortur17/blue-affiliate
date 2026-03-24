import Image from "next/image";
import Link from "next/link";
import { IconComponent } from "./Icon";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-primary rounded-2xl pl-6 pr-15 py-7">
      <Link href="/">
        <Image src="/logo.svg" alt="Blue Affiliate" width={100} height={100} />
      </Link>

      <ul className="flex items-center text-white">
        <li>
          <Link href="/">
            <IconComponent icon="Globe" className="text-white" />
          </Link>
        </li>
        <li className="pl-4">
          <div className="flex items-center gap-2">
            <IconComponent icon="ChevronDown" className="text-white" />
            <span>Kr</span>
          </div>
        </li>
        <li className="pl-8">
          <div className="flex items-center gap-2">
            <IconComponent icon="User" className="text-white" />
            <span className="font-medium">Your account</span>
          </div>
        </li>
      </ul>
    </nav>
  );
}
