import CaseManager from './CaseManager';
const OfficeSolved = () => (
  <CaseManager title="Resolved & Closed Cases" filterStatuses={["Closed"]} />
);
export default OfficeSolved;