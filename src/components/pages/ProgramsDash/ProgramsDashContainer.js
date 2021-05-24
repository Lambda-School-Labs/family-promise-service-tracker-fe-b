import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { useOktaAuth } from '@okta/okta-react';
import { getUserAction } from '../../../state/actions';
import RenderProgramsDash from './RenderProgramsDash';
import { TableComponent } from '../../common';
import ProgramTable from '../../common/ProgramsTable/ProgramTable';
import TitleComponent from '../../common/Title';

function ProgramsDashContainer(props, { LoadingOutlined }) {
  const { role } = props;
  const { authState, authService } = useOktaAuth();
  const [userId, setUserId] = useState(false);
  // eslint-disable-next-line
  const [memoAuthService] = useMemo(() => [authService], []);

  useEffect(() => {
    let isSubscribed = true;

    memoAuthService
      .getUser()
      .then(info => {
        if (isSubscribed) {
          setUserId(info.sub);
        }
      })
      .catch(err => {
        isSubscribed = false;
        return setUserId(null);
      });
    return () => (isSubscribed = false);
  }, [memoAuthService]);

  useEffect(() => {
    props.getUserAction(userId);
  }, [userId]);

  return role === 'program_manager' ? (
    <StyledContainer>
      <center>
        <TitleComponent TitleText="Program Manager Dashboard" />
      </center>
      <div className="sub-header">
        <RenderProgramsDash />
      </div>
      <div>
        <ProgramTable />
      </div>
    </StyledContainer>
  ) : (
    <center>
      <h1>You do not have permission to access this page.</h1>
    </center>
  );
}

const StyledContainer = styled.div`
  //border: solid 1px red;
`;

const mapStateToProps = state => {
  return {
    role: state.user.user.role,
  };
};

export default connect(mapStateToProps, { getUserAction })(
  ProgramsDashContainer
);
