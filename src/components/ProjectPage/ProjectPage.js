import React from 'react';
import { Link } from 'redux-little-router';

import { HOME } from '../../constants/routes';
import t from '../../locale';

import Button from '../common/Button';
import ProjectForm from './ProjectForm';

/**
 * Page for project details
 */
const ProjectPage = () => (
  <div>
    <h2>{ t('button.add_project') }</h2>
    <ProjectForm />
    <Button typeClass="primary">
      {t('button.save_project')}
    </Button>
    <Button typeClass="primary">
      <Link href={HOME}>{t('button.cancel')}</Link>
    </Button>
  </div>
);

export default ProjectPage;
