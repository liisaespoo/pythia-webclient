import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import t from '../../locale';
import PLAN_STATUS from '../../constants/plan-status';
import { getCurrentPlan, getCurrentProject } from '../../selectors';
import { getApprovedCommentsFromPreviousVersion, getSortedComments } from './selectors';
import { actions } from './PlanComments.ducks';
import PlanCommentsList from './PlanCommentsList';
import PlanCommentForm from './PlanCommentForm';
import Message from '../common/Message';
import './PlanCommentsSection.css';

/**
 * Select needed props from the global state
 * @param {object} state
 * @return {object} props
 */
const mapStateToProps = (state) => {
  const plan = getCurrentPlan(state);
  const project = getCurrentProject(state);
  const isPlanApproved = plan.status === PLAN_STATUS.APPROVED;

  return {
    plan,
    user: state.user.user,
    comments: isPlanApproved
      ? getSortedComments(state)
      : getApprovedCommentsFromPreviousVersion(state),
    formSendError: state.comments.commentAddError,
    commentEditError: state.comments.commentEditError,
    readOnly: (project && project.completed) || !isPlanApproved,
  };
};

/**
 * Bind action creators to dispatch
 * @param {function} dispatch
 * @return {object} action creators
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  addComment: actions.addComment,
  toggleCommentApproval: actions.toggleCommentApproval,
  clearCommentAddError: actions.clearCommentAddError,
  clearCommentEditError: actions.clearCommentEditError,
}, dispatch);

/**
 * Merge state props and action creators
 * @param {object} stateProps
 * @param {object} actionCreators
 * @return {object} props passed to PlanCommentsSection component
 */
const mergeProps = (stateProps, actionCreators) => ({
  ...stateProps,
  ...actionCreators,
  toggleCommentApproval: (comment, isApproved) =>
    actionCreators.toggleCommentApproval(stateProps.plan, comment, isApproved),
  addComment: comment =>
    actionCreators.addComment(stateProps.plan, comment),
});

/**
 * A wrapper component for displaying a list of plan comments with a header
 * @param {object} props
 * @param {object} props.plan
 * @param {object} props.comments
 * @param {string} props.user
 * @param {function} props.addComment
 * @param {function} props.clearCommentAddError
 * @param {function} props.clearCommentEditError
 * @param {Error} props.formSendError
 * @param {Error} props.commentEditError
 */
const PlanCommentsSection = ({
  plan,
  comments,
  user,
  readOnly,
  addComment,
  toggleCommentApproval,
  clearCommentAddError,
  clearCommentEditError,
  formSendError,
  commentEditError,
}) => (
  <section className="PlanComments__container">
    <h3>{t('plan.comments.title')}</h3>
    { commentEditError &&
      <Message message={commentEditError.message} onClose={clearCommentEditError} />
    }
    <PlanCommentsList
      readOnly={readOnly}
      comments={comments}
      toggleCommentApproval={toggleCommentApproval}
    />
    {!readOnly && <div>
      <h4>{t('plan.comments.form.title')}</h4>
      <PlanCommentForm
        plan={plan}
        initialValues={{ createdBy: user }}
        addComment={addComment}
        formSendError={formSendError}
        clearError={clearCommentAddError}
      />
    </div>}
  </section>
);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(PlanCommentsSection);
