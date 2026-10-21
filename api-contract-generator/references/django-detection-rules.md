# Django Detection Rules — api-contract-generator

Berlaku untuk Django biasa (function-based/class-based views) dan Django REST Framework (DRF). Cek dulu apakah project pakai DRF (`djangorestframework` di `requirements.txt`/`pyproject.toml`) — kalau ya, prioritaskan pattern DRF karena lebih terstruktur.

## 1. Menemukan Endpoint
- Baca `urls.py` di tiap app untuk mapping URL → view:
```python
urlpatterns = [
    path('users/<int:id>/', UserDetailView.as_view()),
    path('login/', views.login_view),
]
```
- `<int:id>` / `<str:slug>` dsb → **Path Params**.

## 2. Path & Query Params
- Path params: ekstrak langsung dari converter di `urls.py` (`<int:id>` → `id: integer, required`).
- Query params: cari `request.GET.get('page')` atau `request.query_params.get('page')` (DRF) di body view/method.

## 3. Request Body — Prioritas Deteksi

**DRF Serializer (prioritas 1)**
```python
class UserCreateSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(min_length=8, required=True)
```
→ Baca field-by-field: nama field, tipe (`EmailField`→string/email, `IntegerField`→integer, `CharField`→string), `required=True/False`, constraint (`min_length`, `max_length`, `choices`).

**DRF ModelSerializer**
```python
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password', 'name']
```
→ Field-nya perlu ditelusuri ke `models.py` untuk tahu tipe data tiap kolom (`CharField`, `EmailField`, `ForeignKey`, dll) dan constraint (`null=True` → optional, `blank=True` → optional di form).

**Django Form (non-DRF)**
```python
class LoginForm(forms.Form):
    email = forms.EmailField(required=True)
```
→ Sama seperti serializer, baca field constraint-nya.

**Manual validation di view (fallback)**
```python
def create_user(request):
    email = request.data.get('email')
    if not email:
        return Response({'error': 'email required'}, status=400)
```
→ Tandai `[validasi manual terdeteksi, field mungkin tidak lengkap — verifikasi manual]`.

## 4. Response
- DRF: cari semua `return Response(data, status=...)` dalam method. Kelompokkan per status code sama seperti Laravel (2xx → Success, 4xx/5xx → Error).
- Django biasa (non-DRF, JSON manual): cari `JsonResponse(data, status=...)`.
- Kalau pakai `Serializer` untuk output juga (`return Response(UserSerializer(user).data)`) → tandai `[response via UserSerializer — struktur ikut field di serializer tsb]`, jangan menebak isinya kalau serializer-nya beda dari yang dipakai di request body.

## 5. Status Code Inference
- Eksplisit di `status=` kwarg → pakai apa adanya (DRF pakai konstanta seperti `status.HTTP_201_CREATED`, terjemahkan ke angka).
- Tidak eksplisit:
  - `Response(data)` tanpa status di DRF → default `200`.
  - GET → asumsi `200`, POST create → asumsi `201`, tandai `[asumsi]` kalau tidak eksplisit.

## 6. Auth Detection
- DRF: cek `permission_classes` di class-based view atau `@permission_classes([...])` decorator:
  - `IsAuthenticated` + `TokenAuthentication`/`JWTAuthentication` di settings → **Bearer Token**
  - `IsAuthenticated` + `SessionAuthentication` → **Session Cookie**
  - `AllowAny` atau tidak ada → **Public**
- Django biasa: cek decorator `@login_required` → **Session Cookie**. Tidak ada → **Public**.

## 7. Skip Condition
- View yang `return render(request, 'template.html', ...)` → SKIP, ini halaman web biasa bukan API.
- View yang cuma redirect (`return redirect(...)`) → SKIP.
