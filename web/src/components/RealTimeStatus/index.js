import React from 'react';
import { connect } from 'react-redux';

import './styles.scss'

const RealTimeStatus = (props) => {
  const { websocketConnected } = props;
  return (
    <div className="status border-top border-bottom">
      {websocketConnected ? (
        <div className="col-6 text-success">
          <i className="fa fa-circle" aria-hidden="true" /> RealTime
        </div>
      ) : (
          <div className="col-6 text-danger">
            <i className="fa fa-circle" aria-hidden="true" /> Disconnected
          </div>
        )}
    </div>
  )
}


const mapStateToProps = state => {
  return {
    websocketConnected: state.config.get('websocketConnected'),
  };
};

export default connect(mapStateToProps)(RealTimeStatus);