import { useOutletContext, Form } from "react-router-dom";
import TrackingOrderModal from "./TrackingOrderModal";
import Title from "../../components/Title";

const Orderstracking = () => {
  const { tracked, key } = useOutletContext();

  return (
    <div className="tracking-component" key={key}>
      <Title>
        <p>Orders Tracking</p>
      </Title>
      {tracked?.length >= 1 ? (
        <div className="tracking-container">
          {tracked
            .map((item, key) => <TrackingOrderModal item={item} key={key} />)
            .reverse()}
        </div>
      ) : (
        <div className="tracking-empty">No order to track</div>
      )}
    </div>
  );
};

export default Orderstracking;
