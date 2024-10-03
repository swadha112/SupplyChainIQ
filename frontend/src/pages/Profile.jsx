import Breadcrumb from '../components/Breadcrumbs/Breadcrumb.tsx';

import TableTwo from '../components/Tables/TableTwo.jsx';


const Profile = () => {
  return (
    <>
      <Breadcrumb pageName="Suppliers" />

      <div className="flex flex-col gap-10">
        
        <TableTwo />
        
      </div>
    </>
  );
};

export default Profile;
