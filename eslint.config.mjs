import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextCoreWebVitals,
  { ignores: ["design_handoff_amapola/**"] },
];

export default eslintConfig;
