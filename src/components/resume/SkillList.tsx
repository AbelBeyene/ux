import { cn } from "../../lib/cn";
import { Tag } from "../ui";

export interface SkillListProps {
  skills: string[];
  className?: string;
}

/** Wrapping row of skill chips. */
export function SkillList({ skills, className }: SkillListProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {skills.map((skill) => (
        <Tag key={skill}>{skill}</Tag>
      ))}
    </div>
  );
}
