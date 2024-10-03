import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

import TableThree from '../../components/Tables/TableThree.jsx';

const FormElements = () => {
  return (
    <>
      <Breadcrumb pageName="Inventory" />

      <div className="flex flex-col gap-10">

        <TableThree />
 
      </div>
    </>
  );
};

export default FormElements;
