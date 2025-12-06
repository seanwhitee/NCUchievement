import DrawerItem, { DrawerItemProps } from "./DrawerItem";

import { PanelsTopLeft } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

export interface DrawerProps {
  links: DrawerItemProps[];
  heading: string;
  onToggle: () => void;
}
export type HeaderProps = Pick<DrawerProps, "heading" | "onToggle">;

const Header = (props: HeaderProps) => {
  const { heading, onToggle } = props;
  return (
    <div className="font-bold text-xl mb-10 flex items-center justify-start gap-2">
      <Button
        variant={"default"}
        onClick={onToggle}
        className="bg-neutral-100 hover:bg-neutral-100/50"
      >
        <PanelsTopLeft className="text-neutral-900" />
      </Button>

      <p>{heading}</p>
    </div>
  );
};

const NavigationDrawer = (props: DrawerProps) => {
  const { heading, links, onToggle } = props;
  return (
    <AnimatePresence>
      <motion.aside
        key={"drawer"}
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 100, damping: 18 }}
        className="px-2 py-2.5 fixed z-20 left-0 top-0 bg-neutral-100 w-full md:w-3xs h-screen shadow-sm"
      >
        <Header heading={heading} onToggle={onToggle} />
        <div className="w-full flex flex-col gap-2">
          {links.map(({ name, href }) => (
            <DrawerItem key={name} name={name} href={href} />
          ))}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};

export default NavigationDrawer;
