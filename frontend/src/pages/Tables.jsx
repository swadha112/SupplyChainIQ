import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TableOne from '../components/Tables/TableOne';
import TableThree from '../components/Tables/TableThree';
import TableTwo from '../components/Tables/TableTwo';
import TableFour from '../components/Tables/TableFour';

const Tables = () => {
  return (
    <>
      <Breadcrumb pageName="Orders" />

      <div className="flex flex-col gap-10">
        <TableOne />
      </div>
    </>
  );
};

export default Tables;
