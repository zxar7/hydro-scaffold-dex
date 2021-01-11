import React from 'react';
import { connect } from 'react-redux';

import Asks from '../Asks';
import Bids from '../Bids';
import Fold from '../Fold';
import RealTimeStatus from '../RealTimeStatus';

import './styles.scss';

const TabHeader = () => {
  return (
    <div className="flex header text-secondary">
      <div className="col-4 text-center">Amount</div>
      <div className="col-4 text-center">Price</div>
      <div className="col-4 text-center">Total</div>
    </div>
  )
}

const AllTab = () => {
  return (
    <div className="flex-column flex-1">
      <Asks limit={10} />
      <RealTimeStatus />
      <Bids limit={10} />
    </div>
  )
}
const BuyTab = () => {
  return (
    <div className="flex-column flex-1">
      <Asks />
      <RealTimeStatus />
    </div>
  )
}
const SellTab = () => {
  return (
    <div className="flex-column flex-1">
      <RealTimeStatus />
      <Bids />
    </div>
  )
}

class OrderBook extends React.Component {
  constructor(props) {
    super(props);
    this.lastUpdatedAt = null;
    this.forceRenderTimer = null;
    this.tabs = { 'ALL': <AllTab />, 'BUY': <BuyTab />, 'SELL': <SellTab /> };
  }

  // max 1 render in 1 second
  shouldComponentUpdate() {
    if (this.lastUpdatedAt) {
      const diff = new Date().valueOf() - this.lastUpdatedAt;
      const shouldRender = diff > 1000;

      if (!shouldRender && !this.forceRenderTimer) {
        this.forceRenderTimer = setTimeout(() => {
          this.forceUpdate();
          this.forceRenderTimer = null;
        }, 1000 - diff);
      }
      return shouldRender;
    } else {
      return true;
    }
  }

  componentWillUnmount() {
    if (this.forceRenderTimer) {
      clearInterval(this.forceRenderTimer);
    }
  }

  componentDidUpdate() {
    this.lastUpdatedAt = new Date();
  }

  render() {
    return (
      <div className="orderbook flex-column flex-1">
        <Fold className="border-top flex-1 flex-column">
          {Object.keys(this.tabs).map(tab => {
            return (
              <div key={tab} className="orderbook-tab" data-fold-item-title={tab}>
                <TabHeader />
                {this.tabs[tab]}
              </div>)
          })}
        </Fold>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: false,
    theme: state.config.get('theme')
  };
};

export default connect(mapStateToProps)(OrderBook);
