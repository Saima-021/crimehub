import CaseManager from './CaseManager';
const OfficerNewCases = () => (
  <CaseManager title="New Case Assignments" filterStatuses={["Pending"]} />
);
export default OfficerNewCases;