import { useReducer, useCallback, useMemo } from 'react';

/**
 * Generic form state reducer
 * Handles common form operations: field updates, validation, reset
 */
const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        values: {
          ...state.values,
          [action.field]: action.value,
        },
        errors: {
          ...state.errors,
          [action.field]: null, // Clear error when field is updated
        },
        touched: {
          ...state.touched,
          [action.field]: true,
        },
      };

    case 'UPDATE_MULTIPLE_FIELDS':
      return {
        ...state,
        values: {
          ...state.values,
          ...action.fields,
        },
        touched: {
          ...state.touched,
          ...Object.keys(action.fields).reduce((acc, field) => {
            acc[field] = true;
            return acc;
          }, {}),
        },
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.error,
        },
      };

    case 'SET_MULTIPLE_ERRORS':
      return {
        ...state,
        errors: {
          ...state.errors,
          ...action.errors,
        },
      };

    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: {},
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.loading,
      };

    case 'SET_SUBMITTING':
      return {
        ...state,
        submitting: action.submitting,
      };

    case 'RESET_FORM':
      return {
        values: action.initialValues || {},
        errors: {},
        touched: {},
        loading: false,
        submitting: false,
      };

    case 'SET_VALUES':
      return {
        ...state,
        values: action.values,
      };

    default:
      return state;
  }
};

/**
 * Custom hook for form state management
 * Replaces multiple useState calls with a single reducer
 *
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationRules - Validation rules for fields
 * @returns {Object} Form state and handlers
 */
export const useFormReducer = (initialValues = {}, validationRules = {}) => {
  const [state, dispatch] = useReducer(formReducer, {
    values: initialValues,
    errors: {},
    touched: {},
    loading: false,
    submitting: false,
  });

  // Update a single field
  const updateField = useCallback((field, value) => {
    dispatch({
      type: 'UPDATE_FIELD',
      field,
      value,
    });
  }, []);

  // Update multiple fields at once
  const updateFields = useCallback(fields => {
    dispatch({
      type: 'UPDATE_MULTIPLE_FIELDS',
      fields,
    });
  }, []);

  // Set loading state
  const setLoading = useCallback(loading => {
    dispatch({
      type: 'SET_LOADING',
      loading,
    });
  }, []);

  // Set submitting state
  const setSubmitting = useCallback(submitting => {
    dispatch({
      type: 'SET_SUBMITTING',
      submitting,
    });
  }, []);

  // Reset form to initial values
  const resetForm = useCallback(
    newInitialValues => {
      dispatch({
        type: 'RESET_FORM',
        initialValues: newInitialValues || initialValues,
      });
    },
    [initialValues],
  );

  // Set all form values
  const setValues = useCallback(values => {
    dispatch({
      type: 'SET_VALUES',
      values,
    });
  }, []);

  // Validate a single field
  const validateField = useCallback(
    (field, value) => {
      const rules = validationRules[field];
      if (!rules) return null;

      // Check required
      if (rules.required && (!value || value.toString().trim() === '')) {
        return `${rules.label || field} is required`;
      }

      // Check minimum length
      if (
        rules.minLength &&
        value &&
        value.toString().length < rules.minLength
      ) {
        return `${rules.label || field} must be at least ${rules.minLength} characters`;
      }

      // Check maximum length
      if (
        rules.maxLength &&
        value &&
        value.toString().length > rules.maxLength
      ) {
        return `${rules.label || field} must be no more than ${rules.maxLength} characters`;
      }

      // Check pattern (regex)
      if (rules.pattern && value && !rules.pattern.test(value.toString())) {
        return rules.message || `${rules.label || field} format is invalid`;
      }

      // Check custom validation
      if (rules.validate && typeof rules.validate === 'function') {
        return rules.validate(value, state.values);
      }

      return null;
    },
    [validationRules, state.values],
  );

  // Validate entire form
  const validateForm = useCallback(() => {
    const errors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, state.values[field]);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    if (!isValid) {
      dispatch({
        type: 'SET_MULTIPLE_ERRORS',
        errors,
      });
    }

    return isValid;
  }, [validationRules, state.values, validateField]);

  // Set field error
  const setFieldError = useCallback((field, error) => {
    dispatch({
      type: 'SET_ERROR',
      field,
      error,
    });
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    dispatch({
      type: 'CLEAR_ERRORS',
    });
  }, []);

  // Get field props for easy integration with form components
  const getFieldProps = useCallback(
    (field, options = {}) => {
      const {
        type = 'text',
        transform = value => value,
        ...otherOptions
      } = options;

      return {
        value: state.values[field] || '',
        onChange: (event, newValue) => {
          // Handle different input types
          let value;
          if (newValue !== undefined) {
            // Autocomplete or custom components
            value = newValue;
          } else if (type === 'checkbox') {
            value = event.target.checked;
          } else {
            value = event.target.value;
          }

          // Apply transformation if provided
          value = transform(value);

          updateField(field, value);

          // Validate on change if rules exist
          if (validationRules[field]) {
            const error = validateField(field, value);
            if (error) {
              setFieldError(field, error);
            }
          }
        },
        error: !!state.errors[field],
        helperText: state.errors[field] || '',
        ...otherOptions,
      };
    },
    [
      state.values,
      state.errors,
      updateField,
      validateField,
      setFieldError,
      validationRules,
    ],
  );

  // Computed properties
  const isValid = useMemo(() => {
    return Object.keys(state.errors).length === 0;
  }, [state.errors]);

  const isDirty = useMemo(() => {
    return Object.keys(state.touched).length > 0;
  }, [state.touched]);

  const hasErrors = useMemo(() => {
    return Object.keys(state.errors).some(key => state.errors[key]);
  }, [state.errors]);

  return {
    // State
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    loading: state.loading,
    submitting: state.submitting,

    // Computed
    isValid,
    isDirty,
    hasErrors,

    // Actions
    updateField,
    updateFields,
    setLoading,
    setSubmitting,
    resetForm,
    setValues,
    validateForm,
    validateField,
    setFieldError,
    clearErrors,
    getFieldProps,
  };
};

export default useFormReducer;
