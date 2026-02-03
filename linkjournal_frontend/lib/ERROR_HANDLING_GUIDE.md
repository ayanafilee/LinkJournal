# ERROR HANDLING QUICK REFERENCE

## Import the error handlers

```typescript
import { handleError, handleSuccess, handleWarning, handleInfo } from '@/lib/errorHandler';
```

## Import error UI components

```typescript
import { ErrorDisplay, InlineError, EmptyState, LoadingError } from '@/components/ErrorDisplay';
import { ErrorBoundary, AsyncErrorBoundary } from '@/components/ErrorBoundary';
```

---

## BASIC USAGE

### ✅ DO: Use handleError for all errors

```typescript
try {
    await someOperation();
    handleSuccess("Operation completed!");
} catch (error) {
    handleError(error); // Automatically shows appropriate toast
}
```

### ❌ DON'T: Use console.error or toast.error directly

```typescript
try {
    await someOperation();
} catch (error) {
    console.error(error); // ❌ NO!
    toast.error("Failed"); // ❌ NO!
}
```

---

## CUSTOM ERROR MESSAGES

Provide custom user-facing message:

```typescript
try {
    await uploadFile(file);
} catch (error) {
    handleError(error, "Failed to upload your file. Please try again.");
}
```

---

## SUCCESS MESSAGES

```typescript
handleSuccess("Profile updated successfully!");
handleSuccess("File uploaded!", "📤");
```

---

## WARNINGS

```typescript
handleWarning("Please fill in all required fields");
```

---

## INFO MESSAGES

```typescript
handleInfo("Your session will expire in 5 minutes", "⏰");
```

---

## SILENT ERRORS (Development Only)

```typescript
import { handleSilentError } from '@/lib/errorHandler';

try {
    await backgroundSync();
} catch (error) {
    // Won't show toast to user, only logs in dev mode
    handleSilentError(error, 'Background sync failed');
}
```

---

## ERROR DISPLAY COMPONENTS

### Page-level error

```typescript
if (error) {
    return (
        <ErrorDisplay
            variant="error" // or "network", "server", "auth", "notfound"
            title="Failed to Load Data"
            message="We couldn't load your data. Please try again."
            onRetry={() => refetch()}
            showHomeButton={true}
        />
    );
}
```

### Inline error (for forms)

```typescript
{emailError && <InlineError message={emailError} />}
```

### Empty state

```typescript
if (data.length === 0) {
    return (
        <EmptyState
            title="No Journals Yet"
            message="Start by creating your first journal entry"
            actionLabel="Create Journal"
            actionHref="/create_journal"
        />
    );
}
```

### Loading error

```typescript
if (loadingError) {
    return <LoadingError onRetry={() => refetch()} />;
}
```

---

## ERROR BOUNDARIES

### Wrap entire app (already done in layout.tsx)

```typescript
<ErrorBoundary>
    <App />
</ErrorBoundary>
```

### Wrap async components

```typescript
<AsyncErrorBoundary>
    <SomeAsyncComponent />
</AsyncErrorBoundary>
```

### Custom fallback

```typescript
<ErrorBoundary fallback={<CustomErrorUI />}>
    <Component />
</ErrorBoundary>
```

---

## DEBUGGING (Development Mode Only)

In browser console:

```javascript
// View API errors
JSON.parse(sessionStorage.getItem('api_error_logs'))

// View last fetch error
JSON.parse(sessionStorage.getItem('last_fetch_error'))

// View error boundary logs
JSON.parse(sessionStorage.getItem('last_error_boundary'))

// View general errors
JSON.parse(sessionStorage.getItem('error_logs'))
```

---

## COMMON PATTERNS

### Form submission

```typescript
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
        handleWarning("Please fix the errors in the form.");
        return;
    }

    try {
        await submitForm(formData);
        handleSuccess("Form submitted successfully!");
        router.push('/success');
    } catch (error) {
        handleError(error);
    }
};
```

### API mutation

```typescript
const handleDelete = async (id: string) => {
    try {
        await deleteItem(id).unwrap();
        handleSuccess("Item deleted successfully");
    } catch (error) {
        handleError(error, "Failed to delete item");
    }
};
```

### File upload

```typescript
const handleUpload = async (file: File) => {
    try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        const url = await uploadToCloudinary(formData);
        handleSuccess("File uploaded successfully!");
        return url;
    } catch (error) {
        handleError(error, "Failed to upload file");
    } finally {
        setIsUploading(false);
    }
};
```

---

## RTK QUERY INTEGRATION

```typescript
const { data, isLoading, error } = useGetDataQuery();

if (isLoading) {
    return <LoadingSpinner />;
}

if (error) {
    return (
        <ErrorDisplay
            variant="error"
            title="Failed to Load"
            message="We couldn't load the data. Please try again."
            onRetry={() => refetch()}
        />
    );
}
```

---

## FIREBASE AUTH ERRORS

Automatically handled by `handleError()`:
- `auth/email-already-in-use`
- `auth/invalid-credential`
- `auth/too-many-requests`
- `auth/popup-blocked`
- `auth/popup-closed-by-user`
- And 10+ more...

```typescript
try {
    await signInWithEmailAndPassword(auth, email, password);
    handleSuccess("Login successful!");
} catch (error) {
    handleError(error); // Shows appropriate message automatically
}
```

---

## NOTES

1. **NEVER** use `console.log`, `console.error`, or `console.warn` in production code
2. **ALWAYS** use `handleError()` instead of `toast.error()`
3. Provide custom messages when the default isn't clear enough
4. Use appropriate error variants for better UX
5. Wrap async components with `AsyncErrorBoundary`
6. All errors are automatically logged in development mode
7. Error logs are stored in `sessionStorage` (not `localStorage`)
8. Logs are capped at 50 entries to prevent memory issues
