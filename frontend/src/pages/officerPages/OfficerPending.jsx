import CaseManager from './CaseManager';
const OfficerPending = () => (
  <CaseManager title="Ongoing Investigations" filterStatuses={["Under Investigation", "Action Required"]} />
);
export default OfficerPending;