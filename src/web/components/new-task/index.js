import React, { Component, PropTypes } from 'react';

import styles from './new-task.scss';

const defaultState = {
  title: '',
  daysEstimated: '',
  isValid: false,
};

class NewTask extends Component {
  constructor(props) {
    super(props);

    this.state = defaultState;

    this._updateTitle = this.updateTitle.bind(this);
    this._updateEstimate = this.updateEstimate.bind(this);
    this._handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    const { isValid, title, daysEstimated } = this.state;

    if (isValid) {
      this.props.createTask({ title, daysEstimated });

      this.setState(defaultState);
    }
  }

  updateTitle(e) {
    const title = e.target.value;

    this.setState({
      title,
      isValid: this.validate({
        title,
        daysEstimated: this.state.daysEstimated,
      }),
    });
  }

  updateEstimate(e) {
    const daysEstimated = e.target.value;

    this.setState({
      daysEstimated,
      isValid: this.validate({
        daysEstimated,
        title: this.state.title,
      }),
    });
  }

  validate({ title, daysEstimated }) {
    return title && !Number.isNaN(Number(daysEstimated));
  }

  render() {
    const { isValid, title, daysEstimated } = this.state;

    return (
      <div className={styles.newTask}>
        <form onSubmit={this._handleSubmit} className={styles.form}>
          <button
            className={styles.submit}
            disabled={!isValid}
          >
            +
          </button>
          <fieldset className={styles.fieldset}>
            <label
              htmlFor="title"
              className={styles.label}
            >
              What's next on the docket?
            </label>
            <input
              id="title"
              className={styles.input}
              value={title}
              onChange={this._updateTitle}
              placeholder="Make something fancy!"
            />
            <label
              htmlFor="daysEstimated"
              className={styles.label}
            >
              How long do you think it will take? (In days)
            </label>
            <input
              id="daysEstimated"
              className={styles.input}
              value={daysEstimated}
              onChange={this._updateEstimate}
              placeholder="1.5"
            />
          </fieldset>
        </form>
      </div>
    );
  }
}

NewTask.propTypes = {
  createTask: PropTypes.func.isRequired,
};

export default NewTask;
