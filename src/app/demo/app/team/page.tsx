"use client";

import { Fragment } from "react";
import { UserPlus } from "lucide-react";
import { Shell, PageTitle } from "@/components/demo/Shell";
import { Avatar, Btn, Note, PermMark } from "@/components/demo/ui";
import { useDemo } from "@/lib/demo/store";
import { PERMS, ROLE_LABEL, ROLE_ORDER, team, type Role } from "@/lib/demo/data";

const WHO: Record<Role, string> = { owner: "the founder", ops: "whoever runs the desk", guide: "field staff, on a phone", accounts: "your CA, usually external", agent: "a travel agent who sells for you" };

export default function TeamPage() {
  const { role, setRole, notify } = useDemo();
  return (
    <Shell title="Team and roles" actions={role === "owner" && <Btn variant="primary" onClick={() => notify("Invite sent on WhatsApp")}><UserPlus size={14} /> Invite</Btn>} wide>
      <PageTitle title="Team and roles" sub="Five roles. Each person sees only their part of the business. Switch the viewer at the top right to see the console as they do." />

      <section className="card scroll-x">
        <table className="tbl">
          <thead><tr><th>Person</th><th>Role</th><th>What they can do</th><th>Last active</th><th></th></tr></thead>
          <tbody>{team.map((m) => (
            <tr key={m.id} className={role === m.role ? "bg-[var(--d-surface-2)]" : ""}>
              <td><span className="flex items-center gap-2"><Avatar name={m.name} size={26} /><span className="font-medium">{m.name}</span></span></td>
              <td><span className="pill p-neutral">{ROLE_LABEL[m.role]}</span></td>
              <td className="max-w-[420px] text-[13px] text-[var(--d-ink-2)]">{m.note}</td>
              <td className="text-[var(--d-ink-2)]">{m.last}</td>
              <td className="text-right"><button type="button" className="btn btn-ghost btn-sm" onClick={() => { setRole(m.role); notify(`Now viewing as ${m.name}`); }}>View as</button></td>
            </tr>
          ))}</tbody>
        </table>
      </section>

      <section className="card scroll-x">
        <table className="tbl">
          <thead><tr><th>Permission</th>{ROLE_ORDER.map((r) => <th key={r} className={`text-center ${role === r ? "text-[var(--d-ink)]" : ""}`}>{ROLE_LABEL[r]}<span className="block text-[10px] font-normal normal-case tracking-normal text-[var(--d-ink-3)]">{WHO[r]}</span></th>)}</tr></thead>
          <tbody>
            {PERMS.map((a) => (
              <Fragment key={a.area}>
                <tr><td colSpan={6} className="!py-2 eyebrow">{a.area}</td></tr>
                {a.rows.map((r) => (
                  <tr key={r.action}><td>{r.action}</td>{ROLE_ORDER.map((k) => <td key={k} className={`text-center ${role === k ? "bg-[var(--d-surface-2)]" : ""}`}><PermMark v={r[k]} /></td>)}</tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </section>
      <Note>Roles are fixed in the demo. In the product the owner can add a custom role, for example a second office login that cannot cancel bookings.</Note>
    </Shell>
  );
}
