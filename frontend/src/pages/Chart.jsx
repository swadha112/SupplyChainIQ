import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

import TableFour from '../components/Tables/TableFour.jsx';

const Chart = () => {
  return (
    <>
      <Breadcrumb pageName="Logistics" />

      <div className="flex flex-col gap-10">
        <TableFour />
      </div>
    </>
  );
};

export default Chart;
