import * as Yup from 'yup';

export const CreateTaskSchema = Yup.object({
  organizationId: Yup.string().required('Organization ID is required'),
  title: Yup.string()
    .max(100, 'Title must be at most 100 characters')
    .required('Title is required'),
  description: Yup.string().max(
    1000,
    'Description must be at most 1000 characters'
  ),
  dueDate: Yup.date()
    .typeError('Due date must be a valid date')
    .required('Due date is required'),
  priority: Yup.string()
    .oneOf(['low', 'medium', 'high'], 'Invalid priority')
    .required('Priority is required'),
  status: Yup.string()
    .oneOf(['todo', 'in-progress', 'completed'], 'Invalid status')
    .required('Status is required'),
  tags: Yup.array()
    .of(
      Yup.string()
        .max(50, 'Tag must be at most 50 characters')
        .required('Tag cannot be empty')
    )
    .min(1, 'At least one tag is required'),
});

export const UpdateTaskSchema = CreateTaskSchema.shape({
  id: Yup.string().required('Task ID is required'),
});
