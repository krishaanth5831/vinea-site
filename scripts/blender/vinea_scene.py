"""
The night greenhouse, built from a script.

Every picture of the robot on the site comes from this file: a pipe-rail
aisle between two rows of tomato plants, lit by grow lights, with the base on
the pipes and a tool on the arm. Nothing here is a photograph or a frame from
the simulation; the site labels each picture "Concept render".

Run it through scripts/blender/render.sh, which caps memory and threads so a
render can't starve whatever else the machine is doing.

    blender -b -P vinea_scene.py -- --shot what --out /tmp/x.jpg --samples 32

Units are metres. Y runs down the aisle, X across it, Z up.
"""

import argparse
import math
import random
import sys

import bmesh
import bpy
from mathutils import Euler, Vector

# --------------------------------------------------------------------------
# arguments
# --------------------------------------------------------------------------

argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
parser = argparse.ArgumentParser()
parser.add_argument("--shot", default="what")
parser.add_argument("--out", default="/tmp/vinea.jpg")
parser.add_argument("--samples", type=int, default=32)
parser.add_argument("--width", type=int, default=1280)
parser.add_argument("--height", type=int, default=720)
parser.add_argument("--threads", type=int, default=6)
parser.add_argument("--frame", type=int, default=-1, help="one frame of the shot's animation")
parser.add_argument("--frames", default="", help="a-b: render a range into --out (a folder)")
parser.add_argument("--format", default="JPEG")
parser.add_argument("--quality", type=int, default=88)
parser.add_argument("--save-blend", default="")
parser.add_argument(
    "--jobs",
    default="",
    help="stills from one build, comma separated name:WxH:samples; names: plate, hoist, tool-harvest, tool-deleaf, base, scout, aisle, full-<frame>",
)
parser.add_argument("--seq", default="", help="a-b or a-b:step: the moving layer of the scroll sequence, into <out>/seq")
args = parser.parse_args(argv)

random.seed(7)

# The site's accent, as light: the pink-violet of LED grow lights.
GROW = (1.0, 0.16, 0.62)
GROW_SOFT = (0.72, 0.2, 1.0)

RAIL_GAUGE = 0.55  # centre to centre of the two heating pipes
RAIL_R = 0.0255
RAIL_Z = 0.14  # centre height of a pipe
ROW_X = 0.82  # the crop rows sit this far either side of the aisle centre

# --------------------------------------------------------------------------
# small helpers
# --------------------------------------------------------------------------


def clear():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def collection(name):
    c = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(c)
    return c


def link(obj, coll):
    for c in obj.users_collection:
        c.objects.unlink(obj)
    coll.objects.link(obj)
    return obj


def material(name, color, rough=0.5, metal=0.0, **extra):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = metal
    for key, value in extra.items():
        socket = bsdf.inputs.get(key)
        if socket is None:
            continue
        if hasattr(socket.default_value, "__len__") and not hasattr(value, "__len__"):
            continue
        socket.default_value = value
    return m


def emission(name, color, strength):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nodes = m.node_tree.nodes
    nodes.clear()
    out = nodes.new("ShaderNodeOutputMaterial")
    em = nodes.new("ShaderNodeEmission")
    em.inputs["Color"].default_value = (*color, 1)
    em.inputs["Strength"].default_value = strength
    m.node_tree.links.new(em.outputs[0], out.inputs[0])
    try:
        m.cycles.emission_sampling = "NONE"
    except Exception:
        pass
    return m


def smooth(obj, angle=40):
    mesh = obj.data
    for poly in mesh.polygons:
        poly.use_smooth = True
    try:
        mod = obj.modifiers.new("wn", "WEIGHTED_NORMAL")
        mod.keep_sharp = True
    except Exception:
        pass
    return obj


def box(name, size, loc, mat, coll, bevel=0.01, parent=None, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel > 0:
        mod = obj.modifiers.new("bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 4
        mod.limit_method = "ANGLE"
        mod.harden_normals = True
        for poly in obj.data.polygons:
            poly.use_smooth = True
    obj.data.materials.append(mat)
    link(obj, coll)
    if parent is not None:
        obj.parent = parent
    return obj


def cyl(name, r, depth, loc, mat, coll, rot=(0, 0, 0), bevel=0.004, parent=None, verts=48):
    bpy.ops.mesh.primitive_cylinder_add(
        radius=r, depth=depth, location=loc, rotation=rot, vertices=verts
    )
    obj = bpy.context.active_object
    obj.name = name
    if bevel > 0:
        mod = obj.modifiers.new("bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 3
        mod.limit_method = "ANGLE"
        mod.angle_limit = math.radians(50)
        mod.harden_normals = True
    for poly in obj.data.polygons:
        poly.use_smooth = True
    obj.data.materials.append(mat)
    link(obj, coll)
    if parent is not None:
        obj.parent = parent
    return obj


def sphere(name, r, loc, mat, coll, scale=(1, 1, 1), parent=None, seg=32):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=seg, ring_count=seg // 2)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = scale
    for poly in obj.data.polygons:
        poly.use_smooth = True
    obj.data.materials.append(mat)
    link(obj, coll)
    if parent is not None:
        obj.parent = parent
    return obj


def empty(name, loc, coll, parent=None, rot=(0, 0, 0)):
    obj = bpy.data.objects.new(name, None)
    obj.location = loc
    obj.rotation_euler = rot
    obj.empty_display_size = 0.05
    coll.objects.link(obj)
    if parent is not None:
        obj.parent = parent
    return obj


def tube(name, points, radius, mat, coll, parent=None, resolution=6, cyclic=False):
    """A smooth pipe through a list of points."""
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.bevel_depth = radius
    curve.bevel_resolution = resolution
    curve.use_fill_caps = True
    spline = curve.splines.new("NURBS")
    spline.points.add(len(points) - 1)
    for point, co in zip(spline.points, points):
        point.co = (*co, 1)
    spline.use_endpoint_u = True
    spline.use_cyclic_u = cyclic
    spline.order_u = min(4, len(points))
    spline.resolution_u = 8
    obj = bpy.data.objects.new(name, curve)
    curve.materials.append(mat)
    coll.objects.link(obj)
    if parent is not None:
        obj.parent = parent
    return obj


def instance(src, loc, rot, scale, coll, parent=None):
    obj = bpy.data.objects.new(src.name + ".i", src.data)
    obj.location = loc
    obj.rotation_euler = rot
    obj.scale = (scale, scale, scale) if not hasattr(scale, "__len__") else scale
    coll.objects.link(obj)
    if parent is not None:
        obj.parent = parent
    return obj


# --------------------------------------------------------------------------
# materials
# --------------------------------------------------------------------------


def make_materials():
    m = {}
    m["concrete"] = material("concrete", (0.045, 0.047, 0.05), rough=0.3)
    m["rail"] = material("rail", (0.82, 0.82, 0.8), rough=0.28, metal=0.0)
    m["steel"] = material("steel", (0.55, 0.56, 0.58), rough=0.32, metal=1.0)
    m["dark_steel"] = material("dark_steel", (0.09, 0.095, 0.1), rough=0.38, metal=1.0)
    m["gutter"] = material("gutter", (0.78, 0.78, 0.76), rough=0.5)
    m["slab"] = material("slab", (0.88, 0.88, 0.86), rough=0.35)
    m["stem"] = material("stem", (0.11, 0.26, 0.05), rough=0.55)
    m["leaf"] = material(
        "leaf",
        (0.035, 0.16, 0.03),
        rough=0.5,
        **{"Subsurface Weight": 0.25, "Subsurface Scale": 0.01},
    )
    m["calyx"] = material("calyx", (0.06, 0.2, 0.03), rough=0.55)
    tomato = {"Subsurface Weight": 0.18, "Subsurface Scale": 0.012, "Coat Weight": 0.35}
    m["ripe"] = material("ripe", (0.55, 0.012, 0.006), rough=0.16, **tomato)
    m["turning"] = material("turning", (0.62, 0.17, 0.01), rough=0.18, **tomato)
    m["green"] = material("green", (0.2, 0.36, 0.05), rough=0.22, **tomato)
    # The robot: warm white shells, graphite joints, a line of grow-light pink.
    m["shell"] = material("shell", (0.83, 0.83, 0.8), rough=0.34, **{"Coat Weight": 0.25})
    m["graphite"] = material("graphite", (0.028, 0.03, 0.034), rough=0.4, **{"Coat Weight": 0.2})
    m["rubber"] = material("rubber", (0.015, 0.015, 0.016), rough=0.75)
    m["blade"] = material("blade", (0.78, 0.8, 0.82), rough=0.16, metal=1.0)
    m["lens"] = material("lens", (0.005, 0.005, 0.008), rough=0.05, **{"Coat Weight": 1.0})
    m["accent"] = emission("accent", GROW, 14)
    m["lamp"] = emission("lamp", GROW, 30)
    m["worklight"] = emission("worklight", (1.0, 0.94, 0.86), 22)
    m["twine"] = material("twine", (0.75, 0.75, 0.7), rough=0.8)
    m["glass"] = material("glass", (0.02, 0.03, 0.035), rough=0.08)
    return m


# --------------------------------------------------------------------------
# the greenhouse
# --------------------------------------------------------------------------

# The camera looks down the aisle towards -Y, so the rows run far that way.
Y_NEAR, Y_FAR = -26.0, 7.0


def build_aisle(m, coll):
    length = Y_FAR - Y_NEAR
    mid = (Y_FAR + Y_NEAR) / 2
    box("floor", (14, length + 20, 0.1), (0, mid, -0.05), m["concrete"], coll, bevel=0)
    for side in (-1, 1):
        x = side * RAIL_GAUGE / 2
        cyl(
            f"rail{side}", RAIL_R, length, (x, mid, RAIL_Z), m["rail"], coll,
            rot=(math.pi / 2, 0, 0), bevel=0, verts=24,
        )
    # The stands the pipes rest on.
    y = Y_NEAR + 0.4
    while y < Y_FAR:
        box("stand", (RAIL_GAUGE + 0.12, 0.04, 0.012), (0, y, RAIL_Z - RAIL_R - 0.006), m["dark_steel"], coll, bevel=0.002)
        for side in (-1, 1):
            box("leg", (0.03, 0.03, RAIL_Z - RAIL_R), (side * (RAIL_GAUGE / 2 + 0.03), y, (RAIL_Z - RAIL_R) / 2), m["dark_steel"], coll, bevel=0.003)
        y += 1.25


def make_leaflet(m):
    """One leaflet: a pointed oval, folded a little along its midrib."""
    mesh = bpy.data.meshes.new("leaflet")
    bm = bmesh.new()
    n = 9
    rows = []
    for i in range(n + 1):
        t = i / n
        half = 0.5 * math.sin(math.pi * t) ** 0.75 * (1 - 0.35 * t)
        droop = -0.18 * t * t
        y = t
        # A slightly toothed edge, as tomato leaflets have.
        tooth = 1 + (0.12 if i % 2 else -0.04) * (0 < i < n)
        left = bm.verts.new((-half * tooth, y, droop + 0.16 * half))
        centre = bm.verts.new((0, y, droop))
        right = bm.verts.new((half * tooth, y, droop + 0.16 * half))
        rows.append((left, centre, right))
    for a, b in zip(rows, rows[1:]):
        bm.faces.new((a[0], a[1], b[1], b[0]))
        bm.faces.new((a[1], a[2], b[2], b[1]))
    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    for poly in mesh.polygons:
        poly.use_smooth = True
    mesh.materials.append(m["leaf"])
    return mesh


def make_leaf(m, coll, seed):
    """A compound tomato leaf: a drooping stalk with leaflets in pairs."""
    rng = random.Random(seed)
    leaflet = make_leaflet(m)
    parts = []
    length = 0.42
    stalk_pts = []
    for i in range(6):
        t = i / 5
        stalk_pts.append((0, t * length, -0.16 * t * t))
    stalk = tube("leafstalk", stalk_pts, 0.0035, m["stem"], coll, resolution=2)
    parts.append(stalk)
    spots = [(0.3, 0.09), (0.52, 0.12), (0.74, 0.11)]
    for t, size in spots:
        y = t * length
        z = -0.16 * t * t
        for side in (-1, 1):
            obj = bpy.data.objects.new("lf", leaflet)
            obj.location = (side * 0.006, y, z)
            obj.rotation_euler = Euler(
                (rng.uniform(-0.5, -0.15), rng.uniform(-0.3, 0.3), -side * rng.uniform(1.0, 1.35))
            )
            s = size * rng.uniform(0.85, 1.2)
            obj.scale = (s * 0.72, s, s)
            coll.objects.link(obj)
            parts.append(obj)
    tip = bpy.data.objects.new("lf", leaflet)
    tip.location = (0, length, -0.16)
    tip.rotation_euler = Euler((-0.55, 0, rng.uniform(-0.2, 0.2)))
    tip.scale = (0.1, 0.15, 0.15)
    coll.objects.link(tip)
    parts.append(tip)
    return join(parts, f"leaf{seed}")


def join(objs, name):
    bpy.ops.object.select_all(action="DESELECT")
    for obj in objs:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    # Curves have to become meshes before they can join the rest.
    for obj in objs:
        if obj.type == "CURVE":
            bpy.context.view_layer.objects.active = obj
            bpy.ops.object.select_all(action="DESELECT")
            obj.select_set(True)
            bpy.ops.object.convert(target="MESH")
    bpy.ops.object.select_all(action="DESELECT")
    for obj in objs:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    out = bpy.context.active_object
    out.name = name
    out.data.name = name
    for poly in out.data.polygons:
        poly.use_smooth = True
    return out


def make_truss(m, coll, ripeness, seed):
    """
    A truss hanging from the stem: a stalk that arches out and down, with
    fruit alternating either side of it. Its origin is where it meets the
    stem, and it hangs towards +X.
    """
    rng = random.Random(seed)
    parts = []
    pts = [(0, 0, 0), (0.05, 0, 0.012), (0.1, 0, -0.02), (0.13, 0, -0.09), (0.14, 0, -0.19), (0.14, 0, -0.3)]
    parts.append(tube("peduncle", pts, 0.0045, m["stem"], coll, resolution=3))
    count = 6
    for i in range(count):
        t = (i + 0.6) / count
        z = -0.03 - 0.27 * t
        x = 0.1 + 0.04 * min(1, t * 2.5)
        side = -1 if i % 2 else 1
        r = rng.uniform(0.027, 0.031) * (1 - 0.12 * t)
        # Which colour this fruit is: the truss ripens from the stem end.
        if ripeness == "ripe":
            mat = m["ripe"]
        elif ripeness == "turning":
            mat = m["ripe"] if t < 0.3 else (m["turning"] if t < 0.7 else m["green"])
        else:
            mat = m["green"]
        centre = Vector((x + rng.uniform(-0.006, 0.006), side * (r + 0.008), z))
        fruit = sphere("fruit", r, centre, mat, coll, scale=(1, 1, 0.9), seg=20)
        parts.append(fruit)
        # The short stalk from the truss to the fruit, and the green star on top.
        top = centre + Vector((0, 0, r * 0.86))
        parts.append(tube("pedicel", [(x, 0, z + 0.04), tuple((Vector((x, 0, z + 0.04)) + top) / 2 + Vector((0, 0, 0.01))), tuple(top)], 0.0026, m["stem"], coll, resolution=2))
        for k in range(5):
            a = k * math.tau / 5 + rng.uniform(0, 0.4)
            sepal = sphere("sepal", 0.011, top + Vector((math.cos(a) * 0.011, math.sin(a) * 0.011, -0.001)), m["calyx"], coll, scale=(1, 0.3, 0.14), seg=8)
            sepal.rotation_euler = Euler((0, 0.35, a))
            parts.append(sepal)
    return join(parts, f"truss_{ripeness}{seed}")


WIRE_Z = 3.98  # the crop wire the plants hang from
STEM_TOP = 3.72
HERO_X, HERO_Y = ROW_X - 0.012, -0.2  # the plant the modules work on
HERO_LEAN = 0.05
TRUSS_YAW, TRUSS_SCALE = 2.2, 1.05
LEAF_Z = 1.43


def hero_stem(z):
    """Where the hero plant's stem is at height z."""
    t = (z - 0.73) / (STEM_TOP - 0.73)
    return Vector((HERO_X, HERO_Y + HERO_LEAN * t * 3, z))


def make_hook(m, coll):
    """A winding hook: a bobbin of twine with a steel hook that hangs on the crop wire."""
    bobbin = cyl("bobbin", 0.011, 0.16, (0, 0, 0), m["twine"], coll, bevel=0.003, verts=12)
    wire = tube("hookwire", [(0, 0, 0.08), (0, 0, 0.112), (0.01, 0, 0.126), (0.021, 0, 0.112), (0.021, 0, 0.094)], 0.0022, m["stem"], coll, resolution=2)
    return join([bobbin, wire], "hook")


def build_rows(m, coll, protos, marks):
    """Two rows of plants either side of the aisle, and a darker pair beyond."""
    leaves, trusses, hook = protos
    rng = random.Random(3)
    length = Y_FAR - Y_NEAR
    mid = (Y_FAR + Y_NEAR) / 2
    rows = (-ROW_X, ROW_X, -ROW_X - 1.64, ROW_X + 1.64)
    # Operators first, while the scene is still small.
    for row_x in rows:
        box("gutter", (0.2, length, 0.07), (row_x, mid, 0.62), m["gutter"], coll, bevel=0.01)
        box("slab", (0.15, length, 0.075), (row_x, mid, 0.69), m["slab"], coll, bevel=0.02)
        cyl("cropwire", 0.003, length, (row_x, mid, WIRE_Z), m["steel"], coll, rot=(math.pi / 2, 0, 0), bevel=0, verts=8)
    spacing = 0.36
    for row_x in rows:
        near = abs(row_x) < 1
        inward = -1 if row_x > 0 else 1  # which way the aisle is
        y = Y_NEAR + rng.uniform(0, 0.3)
        while y < Y_FAR:
            if not near and y < -14:
                y += spacing
                continue
            hero = row_x == ROW_X and abs(y - HERO_Y) < spacing / 2
            px = HERO_X if hero else row_x
            py = HERO_Y if hero else y
            lean = HERO_LEAN if hero else rng.uniform(0.04, 0.12)
            sway = 0.0 if hero else rng.uniform(-0.03, 0.03)

            def on_stem(z, px=px, py=py, lean=lean, sway=sway):
                t = (z - 0.73) / (STEM_TOP - 0.73)
                return (px + sway * math.sin(t * 5 + py), py + lean * t * 3, z)

            pts = [on_stem(0.73 + k / 8 * (STEM_TOP - 0.73)) for k in range(9)]
            tube("stem", pts, 0.0065, m["stem"], coll, resolution=3)
            tube("twine", [(p[0] + 0.006, p[1], p[2]) for p in pts[::2]] + [(pts[-1][0], pts[-1][1], WIRE_Z - 0.19)], 0.0012, m["twine"], coll, resolution=1)
            instance(hook, (pts[-1][0], pts[-1][1], WIRE_Z - 0.115), (0, 0, rng.uniform(-0.3, 0.3)), 1.0, coll)

            # Trusses in the picking zone: ripe at the bottom, green above.
            heights = [(0.98 + rng.uniform(-0.05, 0.05), "ripe"), (1.27 + rng.uniform(-0.05, 0.05), "turning"), (1.56 + rng.uniform(-0.05, 0.05), "green")]
            for z, ripeness in heights:
                if not near and ripeness != "ripe":
                    continue
                if hero and ripeness == "ripe":
                    continue  # the hero truss is its own object: it gets picked
                src = rng.choice(trusses[ripeness])
                yaw = (0 if inward > 0 else math.pi) + rng.uniform(-0.9, 0.9)
                if hero:
                    yaw = math.pi + (0.5 if ripeness == "turning" else -0.4)
                    marks.append((ripeness, Vector(on_stem(z)) + Vector((math.cos(yaw) * 0.13, math.sin(yaw) * 0.13, 0))))
                instance(src, on_stem(z), (0, 0, yaw), rng.uniform(0.9, 1.08), coll)
            # Leaves from just above the ripening truss upwards. Below it the
            # crew has already taken them off, which is what deleafing is.
            z = (1.66 if hero else 1.36) + rng.uniform(0, 0.1)
            angle = rng.uniform(0, math.tau)
            while z < STEM_TOP:
                angle += 2.4 + rng.uniform(-0.3, 0.3)
                src = rng.choice(leaves)
                tilt = rng.uniform(-0.75, -0.2)
                instance(src, on_stem(z), (tilt, 0, angle), rng.uniform(0.9, 1.3), coll)
                z += rng.uniform(0.1, 0.17) if near else rng.uniform(0.16, 0.26)
            y += spacing


def build_lamps(m, coll):
    """Rows of LED grow lights above the crop: bars you can see, and area lights that do the lighting."""
    for row_x in (-ROW_X, ROW_X, -ROW_X - 1.64, ROW_X + 1.64):
        y = Y_NEAR + 1
        while y < Y_FAR + 14:
            box("lampbar", (0.07, 1.1, 0.035), (row_x * 0.92, y, 4.55), m["lamp"], coll, bevel=0)
            y += 1.9
    # The light itself: a few long panels along the aisle.
    y = -17.0
    k = 0
    while y < 6:
        for row_x in (-ROW_X * 0.9, ROW_X * 0.9):
            data = bpy.data.lights.new("grow", "AREA")
            data.shape = "RECTANGLE"
            data.size = 0.35
            data.size_y = 2.6
            data.energy = 130
            data.color = GROW if (k % 2 == 0) else GROW_SOFT
            obj = bpy.data.objects.new("grow", data)
            obj.location = (row_x, y, 4.5)
            coll.objects.link(obj)
        y += 3.0
        k += 1


# --------------------------------------------------------------------------
# the robot
# --------------------------------------------------------------------------


def build_base(m, coll):
    """
    SPINE: a low cart on four flanged wheels that ride the heating pipes, a
    mast, and a carriage on the mast that carries the arm. Returns the root
    (moves along the pipes) and the carriage (moves up the mast).
    """
    root = empty("spine_root", (0, 0, 0), coll)
    axle_z = RAIL_Z + RAIL_R + 0.058
    deck_z = axle_z + 0.02
    # Chassis: a graphite tub with a white shell over it.
    box("chassis", (0.6, 1.08, 0.2), (0, 0, deck_z + 0.07), m["graphite"], coll, bevel=0.035, parent=root)
    box("shell", (0.66, 1.0, 0.13), (0, 0, deck_z + 0.2), m["shell"], coll, bevel=0.05, parent=root)
    box("deck", (0.5, 0.84, 0.012), (0, 0, deck_z + 0.268), m["graphite"], coll, bevel=0.004, parent=root)
    # The line of light around the cart's waist.
    for y in (-0.5, 0.5):
        box("strip", (0.4, 0.008, 0.012), (0, y * 1.004, deck_z + 0.19), m["accent"], coll, bevel=0, parent=root)
    for x in (-0.331, 0.331):
        box("strip", (0.006, 0.62, 0.008), (x, 0, deck_z + 0.19), m["accent"], coll, bevel=0, parent=root)
    # Wheels: a tread that sits on the pipe and a flange inside it.
    for sx in (-1, 1):
        for sy in (-1, 1):
            x = sx * RAIL_GAUGE / 2
            y = sy * 0.36
            rot = (0, math.pi / 2, 0)
            cyl("wheel", 0.058, 0.07, (x, y, axle_z), m["steel"], coll, rot=rot, parent=root, bevel=0.006)
            cyl("flange", 0.082, 0.012, (x - sx * 0.04, y, axle_z), m["steel"], coll, rot=rot, parent=root, bevel=0.003)
            cyl("hub", 0.03, 0.09, (x + sx * 0.012, y, axle_z), m["graphite"], coll, rot=rot, parent=root, bevel=0.004)
            box("fork", (0.035, 0.11, 0.1), (x + sx * 0.062, y, axle_z + 0.04), m["graphite"], coll, bevel=0.012, parent=root)
    global MOD_Z
    MOD_Z = deck_z + 0.274
    return root


MOD_Z = 0.5  # the top of the cart's deck, where a module sits; set by build_base
MAST_Y = -0.36


def module_plate(m, coll, root, light):
    """What every module stands on: a plate that locks onto the cart's deck, with a line of its own light."""
    box("mod_plate", (0.52, 0.86, 0.03), (0, 0, 0.015), m["graphite"], coll, bevel=0.008, parent=root)
    for sx in (-1, 1):
        for sy in (-1, 1):
            cyl("mod_lock", 0.022, 0.014, (sx * 0.215, sy * 0.385, 0.036), m["steel"], coll, parent=root, bevel=0.003, verts=24)
    box("mod_light", (0.34, 0.006, 0.01), (0, 0.432, 0.016), light, coll, bevel=0, parent=root)


def build_mast(m, coll, root, top):
    """A mast at the back of a module with a carriage that rides it. `top` is its height above the plate."""
    box("mast", (0.11, 0.09, top - 0.06), (0, MAST_Y, 0.03 + (top - 0.06) / 2), m["shell"], coll, bevel=0.02, parent=root)
    box("mast_slot", (0.05, 0.01, top - 0.2), (0, MAST_Y + 0.046, 0.03 + (top - 0.06) / 2), m["graphite"], coll, bevel=0.002, parent=root)
    box("mast_foot", (0.2, 0.17, 0.06), (0, MAST_Y, 0.06), m["graphite"], coll, bevel=0.02, parent=root)
    box("mast_cap", (0.13, 0.11, 0.03), (0, MAST_Y, top), m["graphite"], coll, bevel=0.01, parent=root)
    # Cameras on the mast head that face the row.
    box("masthead", (0.2, 0.07, 0.06), (0, MAST_Y + 0.02, top - 0.11), m["graphite"], coll, bevel=0.016, parent=root)
    for x in (-0.06, 0.06):
        cyl("mastlens", 0.017, 0.012, (x, MAST_Y + 0.058, top - 0.11), m["lens"], coll, rot=(math.pi / 2, 0, 0), parent=root, bevel=0.002)
    carriage = empty("carriage", (0, MAST_Y + 0.05, 0.5), coll, parent=root)
    box("carriage_body", (0.19, 0.12, 0.2), (0, 0.045, 0), m["graphite"], coll, bevel=0.025, parent=carriage)
    box("carriage_plate", (0.2, 0.26, 0.03), (0, 0.16, -0.085), m["graphite"], coll, bevel=0.012, parent=carriage)
    return carriage


def open_box(m, coll, root, name, size, loc, mat, wall=0.012):
    """A crate or a bin: a floor and four walls, open at the top."""
    w, d, h = size
    x, y, z = loc
    box(name + "_floor", (w, d, wall), (x, y, z + wall / 2), mat, coll, bevel=0.003, parent=root)
    for sx in (-1, 1):
        box(name + "_side", (wall, d, h), (x + sx * (w - wall) / 2, y, z + h / 2), mat, coll, bevel=0.004, parent=root)
    for sy in (-1, 1):
        box(name + "_end", (w, wall, h), (x, y + sy * (d - wall) / 2, z + h / 2), mat, coll, bevel=0.004, parent=root)


def build_arm_module(m, coll, base, name, tool_builder, light, holder):
    """
    A module with an arm: plate, mast, carriage, arm, the tool for its job,
    and something on the plate to put what it takes off the plant into.
    """
    root = empty("mod_" + name, (0, 0, MOD_Z), coll, parent=base)
    module_plate(m, coll, root, light)
    carriage = build_mast(m, coll, root, 1.34)
    joints, flange = build_arm(m, coll, carriage, (1.5, 0, 0, 0, 0, 0))
    tool = tool_builder(m, coll, flange)
    holder(m, coll, root)
    return {"kind": "arm", "root": root, "carriage": carriage, "joints": joints, "tool": tool}


def build_hoist_module(m, coll, base, light):
    """
    HOIST is a different machine on the same plate: no arm. A tall mast
    carries a beam out over the row, and on the end of the beam a head that
    rests on the crop wire. The head has two wheels that sit on the wire, a
    rotor that flips the winding hook, and a pair of drums that hold the
    twine while it does.
    """
    root = empty("mod_hoist", (0, 0, MOD_Z), coll, parent=base)
    module_plate(m, coll, root, light)
    # The mast in two sections, the upper one sliding out of the lower.
    box("hoist_foot", (0.26, 0.24, 0.14), (0, MAST_Y + 0.02, 0.1), m["graphite"], coll, bevel=0.03, parent=root)
    box("hoist_lower", (0.16, 0.14, 1.95), (0, MAST_Y, 0.17 + 0.975), m["shell"], coll, bevel=0.03, parent=root)
    box("hoist_upper", (0.11, 0.095, 1.75), (0, MAST_Y, 2.05 + 0.875), m["graphite"], coll, bevel=0.02, parent=root)
    box("hoist_rail", (0.04, 0.012, 3.5), (0, MAST_Y + 0.073, 1.95), m["steel"], coll, bevel=0.002, parent=root)
    box("hoist_drive", (0.2, 0.16, 0.2), (0, MAST_Y + 0.21, 0.13), m["shell"], coll, bevel=0.035, parent=root)
    cyl("hoist_drum", 0.06, 0.16, (0, MAST_Y + 0.21, 0.27), m["graphite"], coll, rot=(0, math.pi / 2, 0), parent=root, bevel=0.01)
    # The carriage and the beam it carries out over the row.
    carriage = empty("hoist_carriage", (0, MAST_Y + 0.08, 0.9), coll, parent=root)
    box("hoist_car", (0.22, 0.13, 0.26), (0, 0.03, 0), m["graphite"], coll, bevel=0.03, parent=carriage)
    box("hoist_beam", (1.02, 0.07, 0.055), (0.45, 0.13, 0.03), m["shell"], coll, bevel=0.014, parent=carriage)
    box("hoist_beam_rail", (0.98, 0.012, 0.02), (0.45, 0.168, 0.03), m["steel"], coll, bevel=0.002, parent=carriage)
    # The head, which slides along the beam.
    head = empty("hoist_head", (0.25, 0.2, 0.03), coll, parent=carriage)
    box("head_slide", (0.16, 0.05, 0.11), (0.05, -0.01, 0), m["graphite"], coll, bevel=0.012, parent=head)
    box("head_plate", (0.016, 0.3, 0.38), (0.128, 0.16, 0.02), m["shell"], coll, bevel=0.006, parent=head)
    box("head_shelf", (0.14, 0.3, 0.016), (0.062, 0.16, 0.205), m["shell"], coll, bevel=0.005, parent=head)
    for sy in (-1, 1):
        # Grooved wheels that sit on the wire.
        cyl("saddle", 0.03, 0.022, (0.07, 0.16 + sy * 0.09, 0.16), m["graphite"], coll, rot=(0, math.pi / 2, 0), parent=head, bevel=0.005)
        cyl("saddle_hub", 0.012, 0.03, (0.07, 0.16 + sy * 0.09, 0.16), m["steel"], coll, rot=(0, math.pi / 2, 0), parent=head, bevel=0.002)
        box("saddle_arm", (0.012, 0.012, 0.06), (0.052, 0.16 + sy * 0.09, 0.182), m["steel"], coll, bevel=0.002, parent=head)
    # The rotor that takes the hook and flips it.
    rotor = empty("rotor", (0.07, 0.16, 0.07), coll, parent=head)
    cyl("rotor_disc", 0.04, 0.018, (0, 0, 0), m["steel"], coll, rot=(0, math.pi / 2, 0), parent=rotor, bevel=0.004)
    cyl("rotor_ring", 0.042, 0.005, (0.011, 0, 0), light, coll, rot=(0, math.pi / 2, 0), parent=rotor, bevel=0)
    box("rotor_fork", (0.012, 0.012, 0.07), (0.016, 0.018, 0.02), m["steel"], coll, bevel=0.002, parent=rotor)
    box("rotor_fork", (0.012, 0.012, 0.07), (0.016, -0.018, 0.02), m["steel"], coll, bevel=0.002, parent=rotor)
    # The pair of drums that hold the twine, below the rotor.
    box("capstan_arm", (0.03, 0.05, 0.2), (0.108, 0.16, -0.1), m["graphite"], coll, bevel=0.008, parent=head)
    for sy in (-1, 1):
        cyl("capstan", 0.024, 0.07, (0.075, 0.16 + sy * 0.027, -0.17), m["rubber"], coll, rot=(0, math.pi / 2, 0), parent=head, bevel=0.004)
    cyl("head_lens", 0.012, 0.012, (0.116, 0.25, 0.1), m["lens"], coll, rot=(0, math.pi / 2, 0), parent=head, bevel=0.002)
    return {"kind": "hoist", "root": root, "carriage": carriage, "head": head, "rotor": rotor}


def build_arm(m, coll, carriage, pose):
    """
    A six-joint arm on the carriage. `pose` is the six joint angles in
    radians: base yaw, shoulder, elbow, wrist pitch, wrist yaw, tool roll.
    Returns the joints and the flange the tool mounts on.
    """
    j = []
    base = empty("arm_base", (0, 0.2, -0.07), coll, parent=carriage)
    cyl("arm_foot", 0.07, 0.05, (0, 0, 0.025), m["graphite"], coll, parent=base, bevel=0.008)
    # 1: base yaw
    j1 = empty("j1", (0, 0, 0.05), coll, parent=base)
    cyl("turret", 0.062, 0.11, (0, 0, 0.055), m["shell"], coll, parent=j1, bevel=0.012)
    cyl("shoulder_housing", 0.06, 0.15, (0, 0, 0.12), m["shell"], coll, rot=(0, math.pi / 2, 0), parent=j1, bevel=0.012)
    for sx in (-1, 1):
        cyl("cap", 0.05, 0.012, (sx * 0.078, 0, 0.12), m["graphite"], coll, rot=(0, math.pi / 2, 0), parent=j1, bevel=0.004)
    # 2: shoulder pitch (about X)
    j2 = empty("j2", (0.0, 0, 0.12), coll, parent=j1)
    upper = 0.44
    box("upper_arm", (0.085, 0.085, upper), (0, 0, upper / 2), m["shell"], coll, bevel=0.03, parent=j2)
    cyl("elbow_housing", 0.052, 0.13, (0, 0, upper), m["shell"], coll, rot=(0, math.pi / 2, 0), parent=j2, bevel=0.01)
    for sx in (-1, 1):
        cyl("cap", 0.043, 0.012, (sx * 0.068, 0, upper), m["graphite"], coll, rot=(0, math.pi / 2, 0), parent=j2, bevel=0.004)
    # 3: elbow pitch
    j3 = empty("j3", (0, 0, upper), coll, parent=j2)
    fore = 0.36
    box("forearm", (0.068, 0.068, fore), (0, 0, fore / 2), m["shell"], coll, bevel=0.025, parent=j3)
    cyl("wrist_housing", 0.04, 0.1, (0, 0, fore), m["shell"], coll, rot=(0, math.pi / 2, 0), parent=j3, bevel=0.008)
    for sx in (-1, 1):
        cyl("cap", 0.033, 0.01, (sx * 0.052, 0, fore), m["graphite"], coll, rot=(0, math.pi / 2, 0), parent=j3, bevel=0.003)
    # 4: wrist pitch
    j4 = empty("j4", (0, 0, fore), coll, parent=j3)
    cyl("wrist_a", 0.036, 0.09, (0, 0, 0.055), m["shell"], coll, parent=j4, bevel=0.008)
    # 5: wrist yaw (about the forearm's own axis)
    j5 = empty("j5", (0, 0, 0.1), coll, parent=j4)
    cyl("wrist_b", 0.034, 0.05, (0, 0, 0.02), m["graphite"], coll, parent=j5, bevel=0.006)
    # 6: tool roll, and the flange
    j6 = empty("j6", (0, 0, 0.045), coll, parent=j5)
    cyl("flange", 0.036, 0.012, (0, 0, 0.006), m["steel"], coll, parent=j6, bevel=0.002)
    cyl("flange_ring", 0.0375, 0.004, (0, 0, 0.014), m["accent"], coll, parent=j6, bevel=0)
    flange = empty("flange_mount", (0, 0, 0.016), coll, parent=j6)
    joints = [j1, j2, j3, j4, j5, j6]
    set_pose(joints, pose)
    return joints, flange


AXES = ("z", "x", "x", "x", "z", "z")


def set_pose(joints, pose, frame=None):
    for joint, axis, angle in zip(joints, AXES, pose):
        rot = [0, 0, 0]
        rot["xyz".index(axis)] = angle
        joint.rotation_euler = rot
        if frame is not None:
            joint.keyframe_insert("rotation_euler", frame=frame)


def tool_coupler(m, coll, parent):
    """What every tool has in common: the half of the coupling that meets the flange."""
    cyl("coupler", 0.036, 0.022, (0, 0, 0.011), m["graphite"], coll, parent=parent, bevel=0.004)
    cyl("coupler_neck", 0.026, 0.02, (0, 0, 0.03), m["steel"], coll, parent=parent, bevel=0.003)


def build_tool_harvest(m, coll, parent, name="tool_harvest"):
    """BLUSH: two fingers that close on the truss stalk, a blade at the tips, a camera and a ring of light."""
    root = empty(name, (0, 0, 0), coll, parent=parent)
    tool_coupler(m, coll, root)
    box("palm", (0.086, 0.05, 0.062), (0, 0, 0.07), m["shell"], coll, bevel=0.014, parent=root)
    # Camera pod above the fingers, with the light around it.
    box("pod", (0.05, 0.03, 0.036), (0, -0.038, 0.078), m["graphite"], coll, bevel=0.008, parent=root)
    cyl("lens", 0.011, 0.012, (0, -0.04, 0.1), m["lens"], coll, parent=root, bevel=0.002)
    cyl("ring", 0.018, 0.004, (0, -0.04, 0.097), m["worklight"], coll, parent=root, bevel=0)
    for sx in (-1, 1):
        finger = empty("finger", (sx * 0.026, 0, 0.1), coll, parent=root)
        box("finger_body", (0.016, 0.03, 0.1), (sx * 0.004, 0, 0.05), m["graphite"], coll, bevel=0.005, parent=finger)
        box("pad", (0.006, 0.026, 0.05), (-sx * 0.006, 0, 0.068), m["rubber"], coll, bevel=0.002, parent=finger)
        box("blade", (0.0018, 0.03, 0.022), (-sx * 0.0045, 0, 0.108), m["blade"], coll, bevel=0, parent=finger)
        finger.rotation_euler = (0, sx * 0.1, 0)
    return root


def build_tool_deleaf(m, coll, parent, name="tool_deleaf"):
    """SHEAR: a slim cutter with a hooked guide that finds the leaf stalk."""
    root = empty(name, (0, 0, 0), coll, parent=parent)
    tool_coupler(m, coll, root)
    box("body", (0.05, 0.044, 0.09), (0, 0, 0.085), m["shell"], coll, bevel=0.012, parent=root)
    box("jaw_fixed", (0.012, 0.03, 0.085), (0.012, 0, 0.17), m["graphite"], coll, bevel=0.004, parent=root)
    box("jaw_blade", (0.002, 0.034, 0.07), (-0.004, 0, 0.172), m["blade"], coll, bevel=0, parent=root)
    cyl("pivot", 0.012, 0.05, (0, 0, 0.132), m["steel"], coll, rot=(math.pi / 2, 0, 0), parent=root, bevel=0.002)
    cyl("lens", 0.009, 0.01, (0, -0.024, 0.1), m["lens"], coll, rot=(math.pi / 2, 0, 0), parent=root, bevel=0.002)
    return root


# --------------------------------------------------------------------------
# camera, light, render
# --------------------------------------------------------------------------


def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def add_camera(coll, loc, target, lens=35, fstop=2.8, focus=None):
    data = bpy.data.cameras.new("cam")
    data.lens = lens
    data.sensor_width = 36
    data.dof.use_dof = True
    data.dof.aperture_fstop = fstop
    data.dof.focus_distance = (Vector(focus if focus else target) - Vector(loc)).length
    data.clip_start = 0.05
    data.clip_end = 200
    cam = bpy.data.objects.new("cam", data)
    cam.location = loc
    coll.objects.link(cam)
    look_at(cam, target)
    bpy.context.scene.camera = cam
    return cam


def add_light(coll, kind, loc, target, energy, color=(1, 1, 1), size=0.5, spot=None, parent=None):
    data = bpy.data.lights.new("light", kind)
    data.energy = energy
    data.color = color
    if kind == "AREA":
        data.size = size
    else:
        data.shadow_soft_size = size
    if kind == "SPOT" and spot:
        data.spot_size = spot
        data.spot_blend = 0.5
    obj = bpy.data.objects.new("light", data)
    obj.location = loc
    coll.objects.link(obj)
    look_at(obj, target)
    if parent is not None:
        obj.parent = parent
        obj.matrix_parent_inverse = parent.matrix_world.inverted()
    return obj


def setup_world():
    world = bpy.data.worlds.new("night")
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (0.012, 0.02, 0.03, 1)
    bg.inputs["Strength"].default_value = 0.08
    bpy.context.scene.world = world


def setup_render():
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = args.samples
    scene.cycles.use_adaptive_sampling = True
    scene.cycles.adaptive_threshold = 0.03
    scene.cycles.use_denoising = True
    try:
        scene.cycles.denoiser = "OPENIMAGEDENOISE"
    except Exception:
        pass
    scene.cycles.max_bounces = 5
    scene.cycles.diffuse_bounces = 2
    scene.cycles.glossy_bounces = 3
    scene.cycles.transmission_bounces = 2
    scene.cycles.volume_bounces = 0
    scene.cycles.caustics_reflective = False
    scene.cycles.caustics_refractive = False
    scene.cycles.sample_clamp_indirect = 6
    scene.render.threads_mode = "FIXED"
    scene.render.threads = args.threads
    scene.render.use_persistent_data = True
    scene.render.resolution_x = args.width
    scene.render.resolution_y = args.height
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = args.format
    scene.render.image_settings.quality = args.quality
    scene.render.image_settings.color_mode = "RGB"
    scene.view_settings.view_transform = "AgX"
    for look in ("AgX - Punchy", "AgX - Medium High Contrast"):
        try:
            scene.view_settings.look = look
            break
        except Exception:
            continue
    # A soft bloom around the lamps and the light strips.
    try:
        scene.use_nodes = True
        tree = scene.node_tree
        tree.nodes.clear()
        layers = tree.nodes.new("CompositorNodeRLayers")
        glare = tree.nodes.new("CompositorNodeGlare")
        glare.glare_type = "BLOOM" if "BLOOM" in [e.identifier for e in glare.bl_rna.properties["glare_type"].enum_items] else "FOG_GLOW"
        for key, value in (("Threshold", 1.2), ("Strength", 0.55), ("Size", 0.55), ("Saturation", 1.0)):
            if key in glare.inputs:
                glare.inputs[key].default_value = value
        out = tree.nodes.new("CompositorNodeComposite")
        tree.links.new(layers.outputs["Image"], glare.inputs["Image"])
        tree.links.new(glare.outputs["Image"], out.inputs["Image"])
    except Exception as error:  # the picture is fine without bloom
        print("compositor skipped:", error)


# --------------------------------------------------------------------------
# shots
# --------------------------------------------------------------------------

# --------------------------------------------------------------------------
# the scene
# --------------------------------------------------------------------------

UPPER, FORE = 0.44, 0.36  # the arm's two long links, as build_arm makes them
WRIST_TO_TOOL = 0.161  # from the wrist joint to where a tool mounts
GRIP = {"blush": 0.19, "shear": 0.17}  # from there to where each tool works


def crate(m, coll, root):
    open_box(m, coll, root, "crate", (0.4, 0.3, 0.2), (0, 0.27, 0.03), m["crate"])


def leaf_bin(m, coll, root):
    open_box(m, coll, root, "bin", (0.34, 0.3, 0.36), (0, 0.27, 0.03), m["graphite"])
    box("bin_light", (0.34, 0.004, 0.008), (0, 0.422, 0.37), m["accent2"], coll, bevel=0, parent=root)


def build_scene():
    clear()
    scene = bpy.context.scene
    names = ("greenhouse", "plants", "prototypes", "base", "modules", "dynamic", "shot")
    c = {name: collection(name) for name in names}
    m = make_materials()
    m["crate"] = material("crate", (0.07, 0.11, 0.2), rough=0.45)
    m["accent2"] = emission("accent2", GROW_SOFT, 16)
    m["accent3"] = emission("accent3", (1.0, 0.86, 0.7), 12)
    setup_world()
    build_aisle(m, c["greenhouse"])
    build_lamps(m, c["greenhouse"])
    base = build_base(m, c["base"])
    mods = {
        "blush": build_arm_module(m, c["modules"], base, "blush", build_tool_harvest, m["accent"], crate),
        "shear": build_arm_module(m, c["modules"], base, "shear", build_tool_deleaf, m["accent2"], leaf_bin),
        "hoist": build_hoist_module(m, c["modules"], base, m["accent3"]),
    }
    proto = c["prototypes"]
    leaves = [make_leaf(m, proto, k) for k in (1, 2, 3)]
    trusses = {
        "ripe": [make_truss(m, proto, "ripe", k) for k in (1, 2)],
        "turning": [make_truss(m, proto, "turning", k) for k in (1, 2)],
        "green": [make_truss(m, proto, "green", k) for k in (1, 2)],
    }
    hook = make_hook(m, proto)
    for obj in proto.objects:
        obj.location = (0, 0, -50)  # out of sight; only their copies are in the picture
    marks = []
    build_rows(m, c["plants"], (leaves, trusses, hook), marks)
    # The two things that get taken off the hero plant. They move, so they
    # are their own objects and never part of the still background.
    truss = instance(trusses["ripe"][0], hero_stem(1.0), (0, 0, TRUSS_YAW), TRUSS_SCALE, c["dynamic"])
    leaf = instance(leaves[0], hero_stem(LEAF_Z), (-0.35, 0, math.pi / 2), 1.15, c["dynamic"])
    marks.insert(0, ("ripe", hero_stem(1.0) + Vector((math.cos(TRUSS_YAW) * 0.13, math.sin(TRUSS_YAW) * 0.13, 0))))
    return {"m": m, "c": c, "scene": scene, "base": base, "mods": mods, "truss": truss, "leaf": leaf, "marks": marks, "plants": c["plants"], "shot": c["shot"]}


def clear_view(s, eye, target, near=0.5, along=0.42):
    """
    Take out of the picture any leaf that would hang in front of the lens or
    across the middle of the view. Leaves off to the sides stay, out of
    focus, which is what gives the picture its depth.
    """
    eye = Vector(eye)
    target = Vector(target)
    line = target - eye
    length = line.length
    for obj in s["plants"].objects:
        if not obj.data or not obj.data.name.startswith("leaf"):
            continue
        p = obj.location
        t = max(0.0, min(1.0, (p - eye).dot(line) / (length * length)))
        gap = (p - (eye + line * t)).length
        obj.hide_render = (p - eye).length < near + 0.25 or gap < along


def clear_shot(s):
    for obj in list(s["shot"].objects):
        bpy.data.objects.remove(obj, do_unlink=True)


# --------------------------------------------------------------------------
# the arm: where to put the wrist so the tool reaches a point
# --------------------------------------------------------------------------


def reach_pose(x, dz, yaw=1.5, tool=math.pi / 2, roll=0.0):
    """Joint angles that put the wrist `x` out and `dz` up from the shoulder, with the tool at angle `tool` from straight up."""
    d = max(0.1, min(UPPER + FORE - 0.01, math.hypot(x, dz)))
    phi = math.atan2(x, dz)
    alpha = math.acos(max(-1, min(1, (UPPER * UPPER + d * d - FORE * FORE) / (2 * UPPER * d))))
    a = phi - alpha
    e = math.pi - math.acos(max(-1, min(1, (UPPER * UPPER + FORE * FORE - d * d) / (2 * UPPER * FORE))))
    return (yaw, a, e, tool - (a + e), 0.0, roll)


def shoulder(car):
    """Where an arm module's shoulder is, with its carriage at world height `car`."""
    return Vector((0.0, MAST_Y + 0.25, car + 0.10))


def aim(name, point, car):
    """Wrist reach, wrist height and yaw that put a module's tool on a point, tool level."""
    sh = shoulder(car)
    dx, dy = point.x - sh.x, point.y - sh.y
    return (math.hypot(dx, dy) - WRIST_TO_TOOL - GRIP[name], point.z - sh.z, math.atan2(dx, -dy))


def ease(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


def track(keys, f):
    """A value over the frames: `keys` is (frame, value) pairs, eased between."""
    if f <= keys[0][0]:
        return keys[0][1]
    for (fa, va), (fb, vb) in zip(keys, keys[1:]):
        if f <= fb:
            t = ease((f - fa) / (fb - fa)) if fb > fa else 1.0
            if isinstance(va, (int, float)):
                return va + (vb - va) * t
            return tuple(x + (y - x) * t for x, y in zip(va, vb))
    return keys[-1][1]


# --------------------------------------------------------------------------
# the scroll sequence
# --------------------------------------------------------------------------

AWAY = 60.0  # a module that isn't on the cart is parked far above the scene
LIFT = 2.7  # how high a module lifts to clear the frame
LAST = 156
# The beats, for the page: the frame each one starts on.
BEATS = {"look": 0, "reach": 16, "carry": 34, "swap1": 62, "deleaf": 84, "swap2": 120, "lower": 140, "end": LAST}

CUT = hero_stem(1.0) + Vector((math.cos(TRUSS_YAW) * 0.05 * TRUSS_SCALE, math.sin(TRUSS_YAW) * 0.05 * TRUSS_SCALE, 0.012 * TRUSS_SCALE))
LEAF_CUT = hero_stem(LEAF_Z) + Vector((-0.022, 0.0, 0.0))
TUCK = (0.16, 0.26)


def seq_tracks():
    """Every moving thing in the sequence, as tracks over its frames."""
    mz = MOD_Z
    # BLUSH: look, reach in, cut, carry the truss to the crate.
    bx, bdz, byaw = aim("blush", CUT, 1.02)
    # The carriage rides up for the carry, so the arm can fold in over the crate.
    drop = Vector((0.0, 0.27, mz + 0.03 + 0.2 + 0.34))
    cx, cdz, cyaw = aim("blush", drop, 1.3)
    cx2, cdz2, _ = aim("blush", drop - Vector((0, 0, 0.1)), 1.3)
    blush = {
        "lift": [(0, 0.0), (62, 0.0), (72, LIFT)],
        "car": [(0, 1.2), (16, 1.02), (36, 1.02), (46, 1.3), (56, 1.3), (62, 1.2)],
        "yaw": [(0, 1.5), (4, 1.78), (10, 1.28), (16, 1.5), (24, byaw), (37, byaw), (48, cyaw), (56, cyaw), (62, 1.5)],
        "wrist": [(0, TUCK), (16, TUCK), (22, (0.2, -0.02)), (30, (bx, bdz)), (34, (bx, bdz)), (38, (0.2, -0.04)), (48, (cx, cdz)), (52, (cx2, cdz2)), (55, (cx2, cdz2)), (62, TUCK)],
        "grip": [(0, 0.0), (30, 0.0), (33, 1.0), (52, 1.0), (55, 0.0)],
    }
    # SHEAR: up to the lowest leaf, cut it at the stem, carry it to the bin.
    sx, sdz, syaw = aim("shear", LEAF_CUT, 1.44)
    bin_top = Vector((0.0, 0.27, mz + 0.03 + 0.36 + 0.24))
    ex, edz, eyaw = aim("shear", bin_top, 1.44)
    shear = {
        "lift": [(72, LIFT), (82, 0.0), (120, 0.0), (130, LIFT)],
        "car": [(82, 1.2), (88, 1.44), (114, 1.44), (120, 1.2)],
        "yaw": [(82, 1.5), (88, 1.5), (96, syaw), (101, syaw), (110, eyaw), (114, eyaw), (120, 1.5)],
        "wrist": [(82, TUCK), (88, TUCK), (92, (0.22, -0.02)), (98, (sx, sdz)), (101, (sx, sdz)), (104, (0.2, -0.04)), (110, (ex, edz)), (114, (ex, edz)), (120, TUCK)],
        "grip": [(82, 0.0)],
    }
    # HOIST: the head goes out along the beam and up the mast to the crop wire.
    hoist = {
        "lift": [(130, LIFT + 0.6), (140, 0.0)],
        "car": [(140, 1.5), (145, 1.5), (LAST, 3.3)],
        "head": [(140, 0.25), (147, 0.74)],
    }
    return {"blush": blush, "shear": shear, "hoist": hoist}


ACTIVE = {"blush": (0, 72), "shear": (72, 130), "hoist": (130, LAST)}
TRACKS = None


def apply_frame(s, f):
    """Put every moving part where it is on frame `f` of the sequence."""
    global TRACKS
    if TRACKS is None:
        TRACKS = seq_tracks()
    mods = s["mods"]
    lifts = {}
    for name, mod in mods.items():
        first, last = ACTIVE[name]
        on = first <= f <= last
        tr = TRACKS[name]
        lift = track(tr["lift"], f) if on else AWAY
        lifts[name] = lift
        mod["root"].location.z = MOD_Z + lift
        car = track(tr["car"], f)
        mod["carriage"].location.z = car - MOD_Z
        if mod["kind"] == "arm":
            x, dz = track(tr["wrist"], f)
            roll = math.pi / 2 if name == "blush" else 0.0
            set_pose(mod["joints"], reach_pose(x, dz, yaw=track(tr["yaw"], f), roll=roll))
            grip = track(tr["grip"], f)
            for finger in [c for c in mod["tool"].children if c.name.startswith("finger")]:
                side = 1 if finger.location.x > 0 else -1
                finger.rotation_euler = (0, side * (0.1 - 0.22 * grip), 0)
        else:
            mod["head"].location.x = track(tr["head"], f)
            mod["rotor"].rotation_euler = (0, 0, 0)
    bpy.context.view_layer.update()

    def tip(name):
        return mods[name]["tool"].matrix_world @ Vector((0, 0, GRIP[name]))

    # The truss: on the plant, then in the fingers, then in the crate, then away with the crate.
    truss = s["truss"]
    home = hero_stem(1.0)
    hang = home - CUT  # from the cut point to the truss's own origin
    if f < 33:
        truss.location = home
    elif f <= 53:
        truss.location = tip("blush") + hang
    else:
        rest = Vector((0.03, 0.27 + hang.y, MOD_Z + 0.03 + 0.2 + 0.19 + hang.z))
        truss.location = rest + Vector((0, 0, lifts["blush"]))
    # The leaf: on the plant, then held and swinging down, then into the bin.
    leaf = s["leaf"]
    if f < 100:
        leaf.location, leaf.rotation_euler, leaf.scale = hero_stem(LEAF_Z), (-0.35, 0, math.pi / 2), (1.15, 1.15, 1.15)
    elif f <= 112:
        t = ease((f - 100) / 8)
        leaf.location = tip("shear") + Vector((0.022, 0, 0))
        leaf.rotation_euler = (-0.35 - 1.05 * t, 0, math.pi / 2)
        leaf.scale = (1.15, 1.15, 1.15)
    else:
        t = ease((f - 112) / 4)
        leaf.location = Vector((0.0, 0.27, MOD_Z + 0.03 + 0.36 + 0.24 - 0.3 * t + lifts["shear"]))
        leaf.rotation_euler = (-1.4, 0, math.pi / 2)
        k = 1.15 * (1 - 0.75 * t)
        leaf.scale = (k, k, k)
    bpy.context.view_layer.update()


def layer_collections(root, names, out):
    for child in root.children:
        if child.name in names:
            out.append(child)
        layer_collections(child, names, out)
    return out


def set_pass(s, kind):
    """
    "beauty" renders everything. "layer" renders only what moves, on a clear
    background, with the greenhouse and the cart still there to hide it where
    they are in front.
    """
    scene = s["scene"]
    layer = kind == "layer"
    scene.render.film_transparent = layer
    scene.render.image_settings.color_mode = "RGBA" if layer else "RGB"
    scene.use_nodes = not layer  # no bloom on the layer: it would smear into the clear part
    for lc in layer_collections(bpy.context.view_layer.layer_collection, ("greenhouse", "plants", "base"), []):
        lc.holdout = layer


def static_lights(s):
    shot = s["shot"]
    # Work lights on the row being worked.
    add_light(shot, "SPOT", (0.05, -0.3, 1.8), (0.7, -0.1, 0.95), 150, color=(1.0, 0.96, 0.9), size=0.05, spot=1.5)
    # A cool, dim fill from the aisle so the white shells keep their shape.
    add_light(shot, "AREA", (-0.9, 2.6, 2.0), (0, 0, 0.8), 55, color=(0.7, 0.82, 1.0), size=1.2)
    # A pink rim from behind, down the aisle.
    add_light(shot, "AREA", (-0.2, -3.2, 2.2), (0, 0, 1.0), 220, color=GROW, size=0.9)


SEQ_EYE, SEQ_TARGET = (-0.3, 2.95, 1.16), (0.18, -0.05, 0.92)
# The part of the frame anything moves in, as fractions: left, right, bottom, top.
CROP = (0.24, 0.76, 0.26, 1.0)


def cam_seq(s):
    """The camera the whole sequence is seen from: in front of the cart, down the aisle."""
    clear_shot(s)
    clear_view(s, SEQ_EYE, SEQ_TARGET)
    add_camera(s["shot"], SEQ_EYE, SEQ_TARGET, lens=32, fstop=2.8, focus=(0.45, -0.1, 1.0))
    static_lights(s)


def hide_dynamic(s, hidden):
    for obj in s["c"]["dynamic"].objects:
        obj.hide_render = hidden


def park_modules(s):
    for mod in s["mods"].values():
        mod["root"].location.z = MOD_Z + AWAY
    bpy.context.view_layer.update()


def project(scene, point):
    from bpy_extras.object_utils import world_to_camera_view

    v = world_to_camera_view(scene, scene.camera, Vector(point))
    return round(v.x, 4), round(1 - v.y, 4)


def report_seq(s):
    """What the page needs to know about the sequence, as one line of JSON."""
    import json

    scene = s["scene"]
    bpy.context.view_layer.update()
    marks = []
    for ripeness, top in s["marks"]:
        x, y0 = project(scene, top + Vector((0, 0, 0.03)))
        _, y1 = project(scene, top - Vector((0, 0, 0.33)))
        marks.append({"ready": ripeness == "ripe", "x": x, "y": round((y0 + y1) / 2, 4), "h": round(y1 - y0, 4)})
    info = {
        "frames": LAST + 1,
        "beats": BEATS,
        "crop": {"left": CROP[0], "right": CROP[1], "top": round(1 - CROP[3], 4), "bottom": round(1 - CROP[2], 4)},
        "marks": marks,
        "base": project(scene, (0.0, 0.5, MOD_Z - 0.12)),
    }
    print("SEQINFO " + json.dumps(info))


def render_still(scene, path, width, height, samples, border=None):
    scene.render.resolution_x, scene.render.resolution_y = width, height
    scene.cycles.samples = samples
    scene.render.use_border = border is not None
    scene.render.use_crop_to_border = border is not None
    if border:
        scene.render.border_min_x, scene.render.border_max_x, scene.render.border_min_y, scene.render.border_max_y = border
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)


def run_seq(s):
    """The moving layer, frame by frame. Frames already on disk are skipped, so a stopped run picks up where it was."""
    import os
    import time

    scene = s["scene"]
    spec, _, step = args.seq.partition(":")
    if "," in spec:
        frames = [int(v) for v in spec.split(",")]
    else:
        first, last = (int(v) for v in spec.split("-"))
        frames = list(range(first, last + 1, int(step or 1)))
    cam_seq(s)
    set_pass(s, "layer")
    hide_dynamic(s, False)
    report_seq(s)
    os.makedirs(f"{args.out}/seq", exist_ok=True)
    for f in frames:
        path = f"{args.out}/seq/{f:04d}"
        if os.path.exists(path + ".png"):
            continue
        started = time.time()
        apply_frame(s, f)
        render_still(scene, path, args.width, args.height, args.samples, border=CROP)
        print("SEQFRAME", f, f"{time.time() - started:.1f}s", flush=True)


def run_jobs(s):
    scene = s["scene"]
    for job in [j for j in args.jobs.split(",") if j]:
        name, size, samples = job.split(":")
        width, height = (int(v) for v in size.split("x"))
        set_pass(s, "beauty")
        hide_dynamic(s, False)
        for obj in s["c"]["base"].objects:
            obj.hide_render = False
        if name == "plate":
            # The still background of the sequence: greenhouse and cart, nothing that moves.
            cam_seq(s)
            park_modules(s)
            hide_dynamic(s, True)
            report_seq(s)
        elif name.startswith("full-"):
            # One whole frame of the sequence, to check the layers against.
            cam_seq(s)
            apply_frame(s, int(name[5:]))
        elif name == "hoist":
            # HOIST at its work: the head on the crop wire, seen from below.
            apply_frame(s, LAST)
            hoist = s["mods"]["hoist"]
            hoist["carriage"].location.z = WIRE_Z + 0.03 - 0.19 - MOD_Z
            hoist["head"].location.x = ROW_X - 0.07
            bpy.context.view_layer.update()
            eye, target = (-0.25, 1.05, 2.85), (0.64, -0.2, 3.76)
            clear_shot(s)
            clear_view(s, eye, target, near=0.4, along=0.5)
            add_camera(s["shot"], eye, target, lens=30, fstop=2.8, focus=(0.75, -0.2, 3.9))
            add_light(s["shot"], "SPOT", (0.0, 0.2, 3.0), (0.8, -0.2, 3.9), 120, color=(1.0, 0.96, 0.9), size=0.05, spot=1.4)
            add_light(s["shot"], "AREA", (-0.9, 1.6, 3.2), (0.4, -0.2, 3.7), 40, color=(0.7, 0.82, 1.0), size=1.0)
        elif name in ("tool-harvest", "tool-deleaf"):
            mod = "blush" if name == "tool-harvest" else "shear"
            apply_frame(s, 33 if mod == "blush" else 99)
            point = s["mods"][mod]["tool"].matrix_world @ Vector((0, 0, GRIP[mod]))
            eye, target = point + Vector((-0.36, 0.62, 0.1)), point + Vector((-0.1, 0, -0.03))
            clear_shot(s)
            clear_view(s, eye, target, near=0.35, along=0.3)
            add_camera(s["shot"], eye, target, lens=50, fstop=2.2, focus=point)
            static_lights(s)
        elif name == "base":
            apply_frame(s, 8)
            eye, target = (-0.82, 1.35, 0.4), (0.02, 0.1, 0.36)
            clear_shot(s)
            clear_view(s, eye, target)
            add_camera(s["shot"], eye, target, lens=35, fstop=2.4)
            static_lights(s)
            add_light(s["shot"], "AREA", (-1.0, 1.2, 0.7), (0, 0.2, 0.25), 30, color=(0.75, 0.85, 1.0), size=0.6)
        elif name == "scout":
            apply_frame(s, 8)
            eye, target = (-0.42, 0.42, 1.93), (0.0, -0.33, 1.75)
            clear_shot(s)
            clear_view(s, eye, target, near=0.35, along=0.3)
            add_camera(s["shot"], eye, target, lens=60, fstop=2.0)
            static_lights(s)
            add_light(s["shot"], "AREA", (-0.6, 0.8, 2.1), (0, -0.33, 1.75), 12, color=(0.8, 0.88, 1.0), size=0.4)
        elif name == "aisle":
            park_modules(s)
            hide_dynamic(s, False)
            for obj in s["c"]["base"].objects:
                obj.hide_render = True
            eye, target = (0.0, 5.6, 1.18), (0.0, -6, 1.3)
            clear_shot(s)
            clear_view(s, eye, target, near=0.6, along=0.0)
            add_camera(s["shot"], eye, target, lens=24, fstop=4.0, focus=(0, -1.5, 1.2))
            add_light(s["shot"], "AREA", (0, 3.5, 2.6), (0, 0, 0.6), 40, color=(0.7, 0.82, 1.0), size=1.6)
        else:
            raise SystemExit(f"unknown job {name}")
        render_still(scene, f"{args.out}/{name}", width, height, int(samples))
        print("rendered", name, flush=True)


def main():
    s = build_scene()
    setup_render()
    if args.seq:
        run_seq(s)
    if args.jobs:
        run_jobs(s)
    if args.save_blend:
        bpy.ops.wm.save_as_mainfile(filepath=args.save_blend)


main()
