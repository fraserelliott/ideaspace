import { cx } from "@fraserelliott/fe-utilities/cx";

export const appearance = {
  Panel: "fes-bg-secondary fes-glass-border fes-shadow-subtle fe-rounded-1",
  BtnPrimary: "fes-btn-primary",
  BtnDanger: "fes-btn-danger",
};

export const UI = {
  Btn: (...extra) =>
    cx(
      "fe-d-inline-flex fe-items-center fe-justify-center fe-gap-2 fe-p-em-1 fe-rounded-2 fe-pressable box-shadow-subtle",
      ...extra,
    ),
  BtnPrimary: (...extra) => cx(UI.Btn(), appearance.BtnPrimary, ...extra),
  BtnDanger: (...extra) => cx(UI.Btn(), "btn-danger", ...extra),
  InputPrimary: (...extra) =>
    cx(
      "bg-subtle text-primary glass-border box-shadow-subtle fe-rounded-1",
      ...extra,
    ),
  Panel: (...extra) =>
    cx(
      "fe-p-em-3 fe-d-flex fe-flex-column fe-justify-center panel fe-gap-2",
      appearance.Panel,
      ...extra,
    ),
  Heading: (...extra) => cx("fe-fw-bold font-size-2", ...extra),
  Form: (...extra) =>
    cx(
      "fe-d-flex fe-gap-3 fe-justify-center fe-items-center fe-w-100",
      ...extra,
    ),
  Navbar: (...extra) =>
    cx(
      "fe-d-flex fe-flex-row list-style-none bg-secondary fe-justify-center",
      ...extra,
    ),
  NavItem: (...extra) =>
    cx("fe-d-flex fe-items-center fe-p-em-2 navlink", ...extra),
};
