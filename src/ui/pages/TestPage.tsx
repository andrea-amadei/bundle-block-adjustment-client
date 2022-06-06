import { OptionsPanel } from "../components/common/OptionsPanel";

export function TestPage() {
  return (
    <OptionsPanel
      options={[
        {text:"option 1", onClick: () => alert("test1")},
        {text:"option 2", onClick: () => alert("test2")},
        {text:"option 3", onClick: () => alert("test3")},
      ]}
    />
  );
}