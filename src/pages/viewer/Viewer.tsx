import { useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';
import { PAGE_VIEWER } from '../../graphql/Query';
import './Viewer.scss';

function Viewer() {
  const { ownerId, projectId } = useParams();
  const { loading, error, data } = useQuery(PAGE_VIEWER, {
    variables: {
      watchProjectArgs: {
        projectId: projectId,
        ownerId: ownerId,
        permission: 'view',
      },
    },
  });
  if (error) console.error('Errr...', error);
  return (
    <>
      <div className="cursor">
        <input type="text" id="typing"
        />
        <i></i>
      </div>
      <div id="mask"></div>
    </>
  );
}

export default Viewer;
